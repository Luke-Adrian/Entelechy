function Unique(List) {
    let Output = []
    for (let I of List) if (!Output.includes(I)) Output.push(I)
    return Output
}
function Shorten(Text) {
    let Output = ``
    let String = false
    let A
    let B
    let Space = false
    for (let I of Text.replaceAll(`\r`, ``).replaceAll(`\t`, ` `)) {
        if (I == `\`` && (A != `\\` || B == `\\`)) String = !String
        if (I == `\n`) {
            if (String) {
                B = A
                A = `\n`
                Space = false
                Output += `\n`
            } else if (!Space) {
                B = A
                A = ` `
                Space = true
                Output += ` `
            }
        }
        if (I != `\n` && (String || (A != I || I != ` `))) {
            B = A
            A = I
            Space = I == ` `
            Output += I
        }
    }
    return Output
}
function Prepare(String) {
    let Output = [``]
    let Ignore = false
    for (let I = 0; I < String.length; I++) {
        if (Ignore) {
            if (String[I] == `\`` && (String[I - 1] != `\\` || String[I - 2] == `\\`)) {
                Ignore = false
                Output[Output.length - 1] = `\`` + Output[Output.length - 1] + `\``
            } else {
                Output[Output.length - 1] += String[I]
            }
        } else if (String[I] == `(` || String[I] == `)`) {
            if (Output[Output.length - 1].length == 0) {
                Output[Output.length - 1] = String[I]
            } else Output.push(String[I])
            if (String[I + 1] != undefined && String[I + 1] != ` `) Output.push(``)
        } else if (String[I] == `\``) {
            Ignore = true
        } else if (String[I] == ` ` && String[I - 1] != ` ` && String[I - 1] != undefined) {
            Output.push(``)
        } else Output[Output.length - 1] += String[I]
    }
    return Output
}
function Format(String) {
    let Output = []
    let Indices = []
    let Current = Output
    for (let Item of Prepare(Shorten(String))) switch (Item) {
        case `(`: {
            Indices.push(Current.length)
            Current.push([])
            Current = Current[Current.length - 1]
            break
        }
        case `)`: {
            Indices.splice(-1, 1)
            Current = Output
            for (let Index of Indices) Current = Current[Index]
            break
        }
        default: {
            Current.push(Item)
            break
        }
    }
    return Output[0]
}
function Convert(Structure) {
    if (typeof (Structure) == `object`) {
        let Results = Structure.map(S => Convert(S))
        let Spreads = Structure.map((S, I) => [S, I]).filter(S => typeof (S) == `string` ? false : S[0][0] == `...`).map(S => S[1] - 1)
        let Values = Results.map(S => S[0])
        let List
        switch (Values[0]) {
            case `.`: {
                List = Values.slice(2).join(`, `)
                break
            }
            case `[]`: {
                List = Values.slice(1).map((S, I) => [`Form ("${I}")`, S]).flat().join(`, `)
                break
            }
            default: {
                List = Values.slice(1).join(`, `)
                break
            }
        }
        let Spread_Values = Spreads.length == 0 ? `vector<Structure>({${List}})` : `Prepare (vector<Structure>({${List}}), set<unsigned int>({${Spreads.join(`, `)}}))`
        let Addenda = Results.map(S => S[1]).flat()
        let Defined_Functions = Results.map(S => S[2]).flat()
        switch (Values[0]) {
            case `:=`: {
                if (typeof (Structure[1]) != `string`) {
                    return [`${Convert(Structure[1][1])[0]} = Set (${Convert(Structure[1][1])[0]}, vector<Structure>({${Structure[1].slice(2).map(S => Convert(S)[0]).join(`, `)}}), ${Values[2]})`, Addenda, Defined_Functions]
                } else return [`${Values[1]} = Set (${Values[1]}, vector<Structure>({}), ${Values[2]})`, Addenda, Defined_Functions]
            }
            case `|F|`: {
                return [`Form (Read_File (${Values[1]}.String_Value))`, Addenda, Defined_Functions]
            }
            case `|T|`: {
                return [`Form (Trim (${Values[1]}.String_Value))`, Addenda, Defined_Functions]
            }
            case `|P|`: {
                return [`Form (Parse_JSON (${Values[1]}.String_Value))`, Addenda, Defined_Functions]
            }
            case `|S|`: {
                return [`Form (JSON (${Values[1]}))`, Addenda, Defined_Functions]
            }
            case `_`: {
                return [`${Convert(Structure[1][1])[0]} = Remove (${Convert(Structure[1][1])[0]}, vector<Structure>({${Structure[1].slice(2).map(S => Convert(S)[0]).join(`, `)}}))`, Addenda, Defined_Functions]
            }
            case `::`: {
                return [`Form (Get_Type (${Values[1]}.Type))`, Addenda, Defined_Functions]
            }
            case `[]`: {
                return [`Form (${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `@`: {
                return [`while (${Values[1]}.Double_Value) ${Values[2]}`, Addenda, Defined_Functions]
            }
            case `:`: {
                return [`Range (${Values[1]}, ${Values[2]})`, Addenda, Defined_Functions]
            }
            case `|>`: {
                return [`{\n${Values.slice(1).map(S => S + `;\n`).join(``)}}`, Addenda, Defined_Functions]
            }
            case `[~]`: {
                return [`cout << JSON (${Values[1]}) << endl`, Addenda, Defined_Functions]
            }
            case `+`: {
                return [`Add (${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `-`: {
                return [`Subtract (${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `*`: {
                return [`Multiply (${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `/`: {
                return [`Divide (${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `<#>`: {
                return [`Map (${Values[1]}, ${Values[2]})`, Addenda, Defined_Functions]
            }
            case `<...>`: {
                return [`Reduce (${Values[1]}, ${Values[2]})`, Addenda, Defined_Functions]
            }
            case `.`: {
                return [`Get (${Values[1]}, ${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `.\\`: {
                Lambda_Counter++
                return [`Form (&Lambda_${Lambda_Counter})`, Addenda, [...Defined_Functions,
                `Structure Lambda_${Lambda_Counter} (vector<Structure> Parts) ${[`|>`, `|-`, `@`].includes(Structure[1][0]) ? `{\nArguments.insert(Arguments.begin(), Parts);\n${Values[1]};\nArguments.erase(Arguments.begin());\nreturn Form();\n}` : `{\nArguments.insert(Arguments.begin(), Parts);\nStructure Output = ${Values[1]};\nArguments.erase(Arguments.begin());\nreturn Output;\n}`}`]]
            }
            case `{}`: {
                Lambda_Counter++
                return [`Form (&Lambda_${Lambda_Counter})`, Addenda, [...Defined_Functions, `Structure Lambda_${Lambda_Counter} (vector<Structure> Parts) {\nArguments.insert(Arguments.begin(), Parts);\nStructure Output = Form (${Spread_Values});\nArguments.erase(Arguments.begin());\nreturn Output;\n}`]]
            }
            case `&`: {
                return [`Multiply (${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `|`: {
                return [`Or (${Spread_Values})`, Addenda, Defined_Functions]
            }
            case `>>`: {
                return [`return ${Values[1]}`, Addenda, Defined_Functions]
            }
            case `?`: {
                return [`Form ((rand() % 10000) / 10000.0)`, Addenda, Defined_Functions]
            }
            case `...`: {
                return [Values[1], Addenda, Defined_Functions]
            }
            default: {
                if (Values[0].length < 2) console.log(Values[0])
                return [`(*${Values[0]}.Function_Pointer) (${Spread_Values})`, Addenda, Defined_Functions]
            }
        }
    } else {
        if (Structure.startsWith(`\``) && Structure.endsWith(`\``)) return [`Form ("${Structure.slice(1, -1)}")`, ``, ``]
        if (!isNaN(Structure)) return [`Form (${Structure.includes(`.`) ? Structure : Structure + `.0`})`, ``, ``]
        if (Structure.includes(`?`) && Structure.length > 1) {
            if (Structure.startsWith(`...`)) {
                return [`Prepare (Arguments[${(Structure.split(`?`)[1] || 1) - 1}], set<unsigned int>({}))`, ``, ``]
            } else if (Structure == `??`) {
                return [`Objectify (Arguments[${(Structure.split(`?`)[1] || 1) - 1}])`, ``, ``]
            } else return [`Arguments[${(Structure.split(`?`)[1] || 1) - 1}][${Structure.split(`?`)[0] - 1}]`, ``, ``]
        }
        if (Structure == `None`) return [`Form ()`, ``, ``]
        if (Structure == `True`) return [`Form (1.0)`, ``, ``]
        if (Structure == `False`) return [`Form (0.0)`, ``, ``]
        if (!Functions.includes(Structure)) {
            if (Object.keys(Variables).includes(Structure)) {
                return [Variables[Structure], ``]
            } else {
                Variable_Counter++
                let Variable = `Variable_${Variable_Counter}`
                Variables[Structure] = Variable
                return [Variable, `Structure ${Variable};`, ``]
            }
        }
        return [Structure, ``]
    }
}
function Compile(Text) {
    let [Code, Addendum, Defined_Functions] = Convert(Format(`(|> ${Text})`))
    return Preamble + Unique(Addendum).map(S => S + `\n`).join(``) + Unique(Defined_Functions).join(`\n`) + `\nint main ()\n{\nsrand (${Math.round(Math.random() * 100000)});` + Code + `\nreturn 0;\n}`
}
let File_System = require(`fs`)
let Process = require(`node:child_process`)
let Variable_Counter = 0
let Lambda_Counter = 0
let Preamble = File_System.readFileSync(`Structures.cpp`).toString().split(`int main()`)[0]
let Functions = [`::`, `.:`, `:.`, `{:}`, `{+}`, `{-}`, `{_}`, `{}`, `=~`, `<>`, `<2>`, `<><>`, `<%>`, `<Q>`, `<?>`, `<!>`, `<#>`, `<|>`, `<+>`, `<->`, `<...>`, `<@>`, `<-+>`, `<<>>`, `<_>`, `<F>`, `<||>`, `<~>`, `|~|`, `|#|`, `|@|`, `:=`, `_`, `.\\`, `.`, `[]`, `Mod`, `+`, `-`, `*`, `/`, `^`, `Ln`, `Log`, `Exp`, `\\_`, `\\_/`, `\\__/`, `_/`, `||`, `&`, `|`, `~`, `=`, `~=`, `<=`, `>=`, `<`, `>`, `\\/`, `/\\`, `|||`, `?`, `$`, `|-`, `@`, `|=`, `-<`, `#`, `|>`, `:`, `...`, `>>`, `:!:`, `:?:`, `[~]`, `[@]`, `|F|`, `|T|`, `|P|`, `|S|`]
let Variables = {}
File_System.writeFileSync(`Output.cpp`, Compile(File_System.readFileSync(`Code.ent`).toString()))

let Compilation = Process.spawn(`g++`, [`Output.cpp`, `-o`, `Output`, `-lstdc++`, `-std=c++20`])
Compilation.stdout.setEncoding(`utf-8`)
Compilation.stdout.on(`data`, E => console.log(E))
Compilation.stderr.setEncoding(`utf-8`)
Compilation.stderr.on(`data`, E => console.log(E))
Compilation.on(`exit`, _ => {
    let Output = Process.spawn(`Output.exe`, [])
    console.log(`Start`)
    Output.stdout.setEncoding(`utf-8`)
    Output.stdout.on(`data`, E => console.log(E))
})

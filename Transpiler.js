function Choose(List) {
    return List[Math.floor(Math.random() * List.length)]
}
function Format_List(X, Y = `and`, Z = `,`, W = ``) {
    return X.length == 0 ? `` : (X.length == 1 ? W + X[0] + W : (X.length == 2 ? `${W}${X[0]}${W} ${Y} ${W}${X[1]}${W}` : X.slice(1, -1).reduce((A, B) => A + `${Z}${W} ${W}` + B, W + X[0]) + `${Z}${W} ${Y} ${W}` + X.at(-1) + W))
}
function Mirror(A) {
    if (A == undefined) return A
    if (typeof (A) != `object`) return A
    if (A instanceof Array) return A.map(X => Mirror(X))
    let B = {}
    for (let I of Object.keys(A)) {
        B[I] = Mirror(A[I])
    }
    return B
}
function Type(Input) {
    return { 'bigint': `Number`, 'boolean': `Number`, 'function': `Any`, 'number': `Number`, 'object': `Any`, 'string': `String`, 'symbol': `Any`, 'undefined': `None` }[typeof (Input)]
}
function Unique(List) {
    let Output = []
    for (let I of List) if (!Output.includes(I)) Output.push(I)
    return Output
}
function Shuffle(List) {
    let Buffer = [...List]
    let Output = []
    while (Buffer.length > 0) {
        Output.push(Buffer.splice(Math.floor(Buffer.length * Math.random()), 1)[0])
    }
    return Output
}
function Positive_Modulus(A, B) {
    if (A >= 0) return A % B
    return Positive_Modulus(A + B, B)
}
function Filter(Arguments, World) {
    let [Quantifiers, Sets, Predicate] = Arguments
    if (Sets.length == 0) return []
    let Cardinal = Sets.map(X => X.length).reduce((A, B) => A * B, 1)
    let Indices = []
    let Satisfiers = []
    let Moduli = new Array(Sets.length + 1)
    Moduli[Moduli.length - 1] = 1
    for (let Modulus = Moduli.length - 2; 0 <= Modulus; Modulus--) Moduli[Modulus] = Moduli[Modulus + 1] * Sets[Modulus].length
    for (let I = 0; I < Cardinal; I++) {
        let Remaining_Cardinal = I
        for (let Set = Sets.length - 1; 0 <= Set; Set--) {
            Indices[Set] = (Remaining_Cardinal % Moduli[Set]) / Moduli[Set + 1]
            Remaining_Cardinal -= Remaining_Cardinal % Moduli[Set]
        }
        let Items = Indices.map((Index, Set) => Sets[Set][Index])
        Satisfiers.push([Predicate(...Items, World), Items])
    }
    for (let Modulus = Sets.length - 1; 0 <= Modulus; Modulus--) for (let Sector = 0; Sector < Satisfiers.length; Sector += Moduli[Modulus]) for (let Index = 0; Index < Moduli[Modulus]; Index++) if ((Modulus > 0 || Quantifiers[Modulus]) && Satisfiers[Sector + Index][0] != Quantifiers[Modulus]) { // This should be further investigated.
        for (let I = 0; I < Moduli[Modulus]; I++) Satisfiers[Sector + I][0] = !Quantifiers[Modulus] 
        break
    }
    return Satisfiers.filter(Satisfier => Satisfier[0]).map(Satisfier => Satisfier[1])
}
function Generate(Structure, Primitive_Grammar = P => P, Structure_Grammar = S => S, Higher_Function = undefined) {
    if (typeof (Structure ?? ``) == `string`) return Primitive_Grammar(Structure, Higher_Function)
    return Structure_Grammar(Object.values(Structure).map(S => Generate(S, Primitive_Grammar, Structure_Grammar, Structure[0])), Object.values(Structure), Higher_Function)
}
function Format_Ordinal(N) {
    let Input = `${N}`
    if (Input.endsWith(`1`)) {
        if (Input.slice(-2) == `11`) return Input + `th`
        return Input + `st`
    } else if (Input.endsWith(`2`)) {
        if (Input.slice(-2) == `12`) return Input + `th`
        return Input + `nd`
    } else if (Input.endsWith(`3`)) {
        if (Input.slice(-2) == `13`) return Input + `th`
        return Input + `rd`
    } else return Input + `th`
}
function Shorten(Text) {
    let Output = ``
    let String = false
    let Space = false
    let Comment = false
    let A
    let B
    let C
    for (let I of Text.replaceAll(`\r`, ``).replaceAll(`\t`, ` `)) {
        if (Comment) {
            if (I == `\n`) Comment = false
        } else {
            if ((C == `\n` || C == ` `) && I == `#`) {
                Comment = true
            } else {
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
                C = I
            }
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
function Unformat(Function, Strings = false, Maximum_Length = Infinity) {
    if (Function == undefined) return `None`
    if (typeof (Function) == `object`) {
        if (Function instanceof Array) {
            let Expression = (`(${Strings ? `[] ` : ``}` + Object.values(Function).map(E => Unformat(E, Strings, Maximum_Length)).join(Function[0] == `|>` ? `\n    ` : ` `)).trim() + `)`
            return Expression.length > Maximum_Length ? `(...)` : Expression
        }
        return `(({}${Object.values(Function).length > 0 ? ` ` : ``}` + (Object.keys(Function).length > 0 ? `\n    ` : ``) + Object.keys(Function).map(E => `\`${E}\` ${Unformat(Function[E], Strings, Maximum_Length)}`).join(`\n    `) + `))`
    }
    return `${typeof (Function) == `undefined` ? `None` : (Strings ? (typeof (Function) == `string` ? `\`${Function}\`` : Function) : Function)}`
}
function Unformat_List(List) {
    if (List == undefined) return `undefined`
    if (typeof (List) == `object`) if (List instanceof Array) { return `[${List.map(E => Unformat_List(E)).join(`, `)}]` } else return `{${Object.keys(List).map(Key => `'${Key}': ` + Unformat_List(List[Key])).join(`, `)}}`
    return `\`${Prepare_Text(List)}\``
}
function Literal_Unformat(Function) {
    if (Function == undefined) return `None`
    if (typeof (Function) == `object`) {
        return `(${Object.values(Function).map(F => Literal_Unformat(F)).join(` `)})`
    }
    return Function
}
function Match_Types(A, B) {
    if (A == undefined || B == undefined) return false
    if (A == `Any` || B == `Any`) return true
    if (typeof (A) != typeof (B)) return false
    if (typeof (A) == `object`) {
        if (A.at(-1) != `*` && B.at(-1) != `*`) {
            if (A.length != B.length) return false
            for (let I = 0; I < A.length; I++) if (!Match_Types(A[I], B[I])) return false
            return true
        }
        if (A.at(-1) != `*` && B.at(-1) == `*`) return A.every(X => B.slice(0, -1).some(Y => Match_Types(X, Y)))
        if (A.at(-1) == `*` && B.at(-1) != `*`) return B.every(X => A.slice(0, -1).some(Y => Match_Types(X, Y)))
        if (A.at(-1) == `*` && B.at(-1) == `*`) return A.slice(0, -1).every(X => B.slice(0, -1).some(Y => Match_Types(X, Y)))
    }
    return A == B
}
function Prepare_Text(Text) {
    return Text.replaceAll(`\\`, `\\\\`).replaceAll(`\``, `\\\``).replaceAll(`\n`, `\\n`)
}
function Prepare_Arguments(I) {
    return `Arguments_${I + 1}.length == 0 ? \`\` : \` \` + Arguments_${I + 1}.map (A => Unformat (A, true)).join (\` \`)`
}
function Call(Input, Values, Counter = 0) {
    return `((...${(Values == undefined ? `Arguments` : `Results`) + (Counter > 0 ? `_${Counter}` : ``)}) => ${Input})` + (Values == undefined ? `` : ` (${Values.join(`, `)})`)
}
function Convert(Expression, References = {}, Warning = false, Warnings = [], Count = 1, Path = [], Name = undefined, Literal = false) {
    if (typeof (Expression) == `object`) {
        let Types = []
        let Values = []
        if (Expression[0] == `.\\` && Expression.length > 2) for (let I = 0; I < Expression.length - 2; I++) References[`${I + 1}?`] = Expression[I + 2]
        let New_Path = Path
        if (Expression[0] == `{}` || Expression[0] == `.\\`) New_Path = [...Path, Name == undefined ? Unformat(Expression, false, 512) : Unformat(Name, false, 512)]
        let Calculations = Expression.map(E => Convert(E, References, Warning, Warnings, (Expression[0] == `{}` || Expression[0] == `.\\`) ? Count + 1 : Count, (Expression[0] == `{}` || Expression[0] == `.\\`) ? New_Path : Path, (Expression[0] == `:=` || Expression[0] == `_`) ? Expression[1] : undefined, Expression[0] == `<>` || Literal))
        Values = Calculations.map(E => E[0])
        Types = Calculations.map(E => E[1])
        if (Functions.includes(Values[0])) {
            switch (Values[0]) {
                case `:=`: {
                    if (Warning
                        && Types[1] != `None`
                        && Types[1] != `Any`
                        && Types[1] != undefined
                        && JSON.stringify(Types[1]) != JSON.stringify(Types[2])
                        && !(typeof (Types[1]) == typeof (Types[2])
                            && typeof (Types[1]) == `object` ? (Types[1].at(-1) == `*`
                                && Types[2].at(-1) == `*`
                                && ((Types[1].every(T => Types[2].includes(T))
                                    && Types[2].every(T => Types[1].includes(T))) || Types[1][0] == `Any`)) : false)) console.log(`Warning: ${Unformat(Expression[1])} is of type ${Unformat(Types[1] || `None`)}, whereas ${Unformat(Expression[2])} is of type ${Unformat(Types[2] || `None`)}.`)
                    break
                }
            }
            let Return_Value = undefined
            switch (Values[0]) {
                case `::`: { Return_Value = `Type (${Values[1]})`; break }
                case `.%`: { Return_Value = `Object.values (${Values[1]}).indexOf (${Values[2]})`; break }
                case `.:`: { Return_Value = `Object.keys (${Values[1]})`; break }
                case `.?`: { Return_Value = Call(`Object.keys (Results[0]).filter (Key => ((JSON.stringify (Results[0][Key]) == JSON.stringify (Results[1]) && typeof (Results[0][Key]) == typeof (Results[1])) || (Results[0][Key] == undefined && Results[1] == undefined) || (Results[0][Key] == undefined && Results[1] == undefined)))[0]`, Values.slice(1)); break }
                case `:.`: { Return_Value = Call(`Object.keys (Results[0]).filter (Key => !Results.slice (1).includes (Key)).map (Key => Results[0][Key])`, Values.slice(1)); break }
                case `{:}`: { Return_Value = Call(`{ Object.keys (Results[1]).map (Key => Results[0][Key] = Results[1][Key]); return Results[0] }`, Values.slice(1)); break }
                case `{+}`: { Return_Value = Call(`{ Object.keys (Results[1]).filter (Key => !Object.keys (Results[0]).includes (Key)).map (Key => Results[0][Key] = Results[1][Key]); return Results[0] }`, Values.slice(1)); break }
                case `{-}`: { Return_Value = Call(`{ Object.keys (Results[0]).filter (Key => !Object.keys (Results[1]).includes (Key)).map (Key => delete Results[0][Key]); return Results[0] }`, Values.slice(1)); break }
                case `{_}`: { Return_Value = Call(`{ Object.keys (Results[1]).map (Key => delete Results[0][Key]); return Results[0] }`, Values.slice(1)); break }
                case `{}`: { Return_Value = `((...Arguments_${Count}) => { let Type_${Count} = { }; ${Values.slice(1).map((Value, Index) => Index % 2 == 0 ? `Type_${Count}[${Value}]` + ` = ` : Value + `; `).join(``)}return Type_${Count} })`; break }
                case `=~`: { Return_Value = Call(`(Object.keys (State).filter (Key => State[Key] != undefined ? (Object.keys (State[Key]) != undefined ? Object.keys (Results[0]).every (Property => Object.keys (State[Key]).includes (Property)) : false) : false))`, Values.slice(1)); break }
                case `<>`: { Return_Value = Unformat_List(Expression[1]); break }
                case `<2>`: { Return_Value = `[${Values[1]}, ${Unformat_List(Expression[1])}]`; break }
                case `<><>`: { Return_Value = `[... ${Values[1]}].reverse ()`; break }
                case `<%>`: { Return_Value = `(Object.values (${Values[1]}).filter (Item => ${Values[2]} (Item)))`; break }
                case `<Q>`: { Return_Value = Call(`(Filter ([Results.slice (0, -1).filter ((_, Index) => Index % 2 == 0), Results.slice (0, -1).filter ((_, Index) => Index % 2 == 1).map (Result => Object.values (Result)), Results.at (-1)], State))`, Values.slice(1)); break }
                case `<?>`: { Return_Value = `Shuffle (Object.values (${Values[1]}))`; break }
                case `<0?>`: { Return_Value = `Choose (Object.values (${Values[1]}))`; break }
                case `<!>`: { Return_Value = `Unique (Object.values (${Values[1]}))`; break }
                case `<#>`: { Return_Value = `(Object.values (${Values[1]}).map ((Item, Index) => ${Values[2]} (Item, Index)))`; break }
                case `<|>`: { Return_Value = Call(`{ let List = Object.values (Results[0]); if (Results[2] == undefined) { List.splice (Results[1], (Results[3] || 0)) } else List.splice (Results[1], (Results[3] || 0), Results[2]); return List }`, Values.slice(1)); break }
                case `<+>`: { Return_Value = Call(`[...Object.values (Results[0]), ...Results.slice (1)]`, Values.slice(1)); break }
                case `<__>`: { Return_Value = Call(`Results[0].pop ()`, Values.slice(1)); break }
                case `<->`: { Return_Value = Call(`Object.values (Results[0]).filter (Value => !Results.slice (1).includes (Value))`, Values.slice(1)); break }
                case `<...>`: { Return_Value = `(${Values[1]}.reduce ((...Arguments) => ${Values[2]} (...Arguments)${Values.length <= 3 ? `` : `, ${Values[3]}`}))`; break }
                case `<@>`: { Return_Value = `Object.values (${Values[1]}).includes (${Values[2]})`; break }
                case `<-+>`: { Return_Value = Call(Values.length <= 3 ? `Object.values (Results[0]).sort ((A, B) => ${Values.length == 2 ? `A - B` : `Results[1] == undefined ? A - B : Results[1] (A) - Results[1] (B)`})` : `Object.values (Results[0]).sort ((A, B) => Results[1] == undefined || Results[1] == undefined ? Results[2] (A, B) : Results[2] (Results[1] (A), Results[1] (B), A, B))`, Values.slice(1)); break }
                case `<<>>`: { Return_Value = `Generate (${Values.slice(1).join(`, `)})`; break }
                case `<_>`: { Return_Value = `${Values[1]}.flat (${Values[2]})`; break }
                case `<F>`: { Return_Value = `Format_List (${Values[1]}, ${Values[2]}, ${Values[3]})`; break }
                case `<||>`: { Return_Value = `Object.values (${Values[1]}).join (${Values[2]})`; break }
                case `<.>`: { Return_Value = `Object.values (${Values[1]}).at (${Values[2]})`; break }
                case `<~>`: { Return_Value = `Object.values (${Values[1]}).slice (${Values[2]}, ${Values[3]})`; break }
                case `|~|`: { Return_Value = `${Values[1]}.split (${Values[2]})`; break }
                case `|#|`: { Return_Value = `${Values[1]}.replaceAll(${Values[2]}, ${Values[3]})`; break }
                case `|@|`: { Return_Value = `${Values[1]}.includes (${Values[2]})`; break }
                case `|\\_|`: { Return_Value = `(${Values[1]}).toLowerCase ()`; break }
                case `|_/|`: { Return_Value = `(${Values[1]}).toUpperCase ()`; break }
                case `|->|`: { Return_Value = `(${Values[1]}).startsWith (${Values[2]})`; break }
                case `|<-|`: { Return_Value = `(${Values[1]}).endsWith (${Values[2]})`; break }
                case `:=`: {
                    let Context = `Context: ${[... new Array(Path.length).keys()].map(I => `(${Prepare_Text(Path[I])}\${${Prepare_Arguments(I)}})`).join(`\\n`).replaceAll(`\\n`, `\\n             `)}`
                    if (typeof (Expression[2]) == `string`) {
                        Return_Value = Values.length <= 3 ? `(${Values[1]} = ${Values[2]})` :
                            `(Input => { ${Values[3] == `true` ?
                                `if (typeof (Input) == \`undefined\` || Input == undefined || isNaN (Input)) console.log (\`Warning at ${Prepare_Text(Unformat(Expression))}: ${Prepare_Text(Unformat(Expression[2]))} is \${Unformat (Input, true)}.${Path.length > 0 ?
                                    `\\n    ${Context}` : ``}\${Object.keys (Abyss).includes (\`${Expression[2]}\`) ? Abyss[\`${Expression[2]}\`] : \`\\n     Reason: ${Expression[2]} has been undeclared during this iteration.\`}\`)` : `console.log (\`Warning at ${Prepare_Text(Unformat(Expression))}: ${Prepare_Text(Unformat(Expression[2]))} is \${Unformat (Input, true)}.${Path.length > 0 ?
                                        `\\n    ${Context}`
                                        : ``}\${Object.keys (Abyss).includes (\`${Expression[2]}\`) ? Abyss[\`${Expression[2]}\`] : \`\\n     Reason: ${Expression[2]} has been undeclared during this iteration.\`}\`)`}; try { return ${Values[1]} = Input } catch (Error) { console.log (\`Error at ${Prepare_Text(Unformat(Expression))}: The variable to which ${Prepare_Text(Unformat(Expression[2]))} is being assigned is malformed.${Path.length > 0 ? `\\n    ${Context}\${Object.keys (Abyss).includes (\`${Expression[2]}\`) ? Abyss[\`${Expression[2]}\`] : \`\\n     Reason: ${Expression[2]} has been undeclared during this iteration.\`}` : ``}\`); ${Values[1]} = Input } }) (${Values[2]})`
                    } else if (typeof (Expression[2]) == `object`) if (Expression[2][0] == `$`) {
                        Return_Value = Values.length <= 3 ? `(${Values[1]} = ${Values[2]})` :
                            `(Input => { ${Values[3] == `true` ?
                                `if (typeof (State[Input]) == \`undefined\` || State[Input] == undefined || isNaN (State[Input])) console.log (\`Warning at ${Prepare_Text(Unformat(Expression))}: ${Prepare_Text(Unformat(Expression[2]))} is \${Unformat (State[Input], true)}.${Path.length > 0 ?
                                    `\\n    ${Context}` : ``}\${Object.keys (Abyss).includes (Input) ? Abyss[Input] : \`\\n     Reason: \${Input} has been undeclared during this iteration.\`}\`)` : `console.log (\`Warning at ${Prepare_Text(Unformat(Expression))}: ${Prepare_Text(Unformat(Expression[2]))} is \${Unformat (State[Input], true)}.${Path.length > 0 ?
                                        `\\n    ${Context}`
                                        : ``}\${Object.keys (Abyss).includes (Input) ? Abyss[Input] : \`\\n     Reason: \${Input} has been undeclared during this iteration.\`}\`)`}; try { return ${Values[1]} = State[Input] } catch (Error) { console.log (\`Error at ${Prepare_Text(Unformat(Expression))}: The variable to which ${Prepare_Text(Unformat(Expression[2]))} is being assigned is malformed.${Path.length > 0 ? `\\n    ${Context}\${Object.keys (Abyss).includes (Input) ? Abyss[Input] : \`\\n     Reason: \${Input} has been undeclared during this iteration.\`}` : ``}\`); ${Values[1]} = State[Input] } }) (${Convert(Expression[2][1], References, Warning, Warnings, Count, Path)[0]})`
                    } else if (Expression[2][0] == `.`) {
                        let Abyssal_Index = `(. ${[...new Array(Expression[2].length - 1).keys()].map((I, J) => J == 0 ? `\${Input[${I}]}` : `\\\`\${Input[${I}]}\\\``).join(` `)})`
                        let Assignment_Index = `State${[...new Array(Expression[2].length - 1).keys()].map(I => `[Input[${I}]]`).join(``)}`
                        Return_Value = Values.length <= 3 ? `(${Values[1]} = ${Values[2]})` :
                            `((...Input) => { ${Values[3] == `true` ?
                                `if (typeof (${Assignment_Index}) == \`undefined\` || ${Assignment_Index} == undefined || isNaN (${Assignment_Index})) console.log (\`Warning at ${Prepare_Text(Unformat(Expression))}: ${Prepare_Text(Unformat(Expression[2]))} is \${Unformat (${Assignment_Index}, true)}.${Path.length > 0 ?
                                    `\\n    ${Context}` : ``}\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}\`)` : `console.log (\`Warning at ${Prepare_Text(Unformat(Expression))}: ${Prepare_Text(Unformat(Expression[2]))} is \${Unformat (${Assignment_Index}, true)}.${Path.length > 0 ?
                                        `\\n    ${Context}`
                                        : ``}\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}\`)`}; try { return ${Values[1]} = ${Values[2]} } catch (Error) { console.log (\`Error at ${Prepare_Text(Unformat(Expression))}: The variable to which ${Prepare_Text(Unformat(Expression[2]))} is being assigned is malformed.${Path.length > 0 ? `\\n    ${Context}` : ``}\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}\`); ${Values[1]} = ${Assignment_Index} } }) (${typeof (Expression[2][1]) == `string` ?
                                            (Expression[2][1].includes(`?`) || Expression[2][1].endsWith(`@`) ? Convert(Expression[2][1], References, Warning, Warnings, Count, Path)[0] : `\`${Expression[2][1]}\``) : (typeof (Expression[2][1]) == `object` ?
                                                (Expression[2][1][0] == `$` ?
                                                    Convert(Expression[2][1][1], References, Warning, Warnings, Count, Path)[0] : Convert(Expression[2][1], References, Warning, Warnings, Count, Path)[0]) : Expression[2][1])}${Expression[2].length > 2 ?
                                                        `, ` + Expression[2].slice(2).map(E => Convert(E, References, Warning, Warnings, Count, Path)[0]).join(`, `) : ``})`
                    } else Return_Value = `(${Values[1]} = ${Values[2]})`
                    break
                }
                case `_`: {
                    if (typeof (Expression[1]) == `string`) {
                        Return_Value = `${Path.length > 0 ? `Abyss[\`${Expression[1]}\`] = \`${`\\n     Reason: ${[... new Array(Path.length).keys()].map(I => `(${Prepare_Text(Path[I])}\${${Prepare_Arguments(I)}})`).join(`\\n`).replaceAll(`\\n`, `\\n             `)}`}\`; ` : ``}delete ${Values[1]};`
                    } else if (typeof (Expression[1]) == `object`) if (Expression[1][0] == `$`) {
                        Return_Value = `(Input => { ${Path.length > 0 ? `Abyss[Input] = \`${`\\n     Reason: ${[... new Array(Path.length).keys()].map(I => `(${Prepare_Text(Path[I])}\${${Prepare_Arguments(I)}})`).join(`\\n`).replaceAll(`\\n`, `\\n             `)}`}\`; ` : ``}delete State[Input] }) (${Convert(Expression[1][1], References, Warning, Warnings, Count, Path)[0]})`
                    } else if (Expression[1][0] == `.`) {
                        let Abyssal_Index = `\`(. ${[...new Array(Expression[1].length - 1).keys()].map((I, J) => J == 0 ? `\${Input[${I}]}` : `\\\`\${Input[${I}]}\\\``).join(` `)})\``
                        //let Deletion_Index = `State${[...new Array(Expression[1].length - 1).keys()].map(I => `[Input[${I}]]`).join(``)}`
                        Return_Value = `((...Input) => { ${Path.length > 0 ? `Abyss[${Abyssal_Index}] = \`${`\\n     Reason: ${[... new Array(Path.length).keys()].map(I => `(${Prepare_Text(Path[I])}\${${Prepare_Arguments(I)}})`).join(`\\n`).replaceAll(`\\n`, `\\n             `)}`}\`; ` : ``}delete ${Values[1]} }) (${typeof (Expression[1][1]) == `string` ?
                            (Expression[1][1].includes(`?`) || Expression[1][1].endsWith(`@`) ? Convert(Expression[1][1], References, Warning, Warnings, Count, Path)[0] : `\`${Expression[1][1]}\``) : (typeof (Expression[1][1]) == `object` ?
                                (Expression[1][1][0] == `$` ?
                                    Convert(Expression[1][1][1], References, Warning, Warnings, Count, Path)[0] : Convert(Expression[1][1], References, Warning, Warnings, Count, Path)[0]) : Expression[1][1])}${Expression[1].length > 2 ?
                                        `, ` + Expression[1].slice(2).map(E => Convert(E, References, Warning, Warnings, Count, Path)[0]).join(`, `) : ``})`
                    }
                    break
                }
                case `.\\`: { Return_Value = Call(Values[1], undefined, Count); break }
                case `.`: {
                    let Context = `Context: ${[... new Array(Count - 1).keys()].map(I => `(${Prepare_Text(Path[I])}\${${Prepare_Arguments(I)}})`).join(`\\n`).replaceAll(`\\n`, `\\n             `)}`
                    let Abyssal_Index = `(. ${[...new Array(Expression.length - 1).keys()].map((I, J) => J == 0 ? `\${Input[${I}]}` : `\\\`\${Input[${I}]}\\\``).join(` `)})`
                    Return_Value = Name != undefined || typeof (Expression) == `string` ? Values[1] + Values.slice(2).map(Value => `[${Value}]`).join(``) :
                        `((...Input) => { let Output = ${typeof (Expression[1]) == `string` ? (Expression[1].includes(`?`) || Expression[1].endsWith(`@`) ? `Input[0]` :
                            `State[Input[0]]`) :
                            (Expression[1][0] == `$` ? `State[Input[0]]` : `Input[0]`)}; if (typeof (Output) == \`undefined\` || Output == undefined) console.log (\`Error at ${Prepare_Text(Unformat(Expression))}: Getting ${Prepare_Text(Unformat(Expression[1]))}, whose value is \${Unformat (Output, true)}, results in None.${Path.length > 0 ? `\\n    ${Context}` : ``}${typeof (Expression[1]) == `string` ? (Expression[1].includes(`?`) ? `` : `\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}`) : (Expression[1][0] == `$` ? `\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}` : ``)}\`); for (let I = 1; I < Input.length; I++) { if (typeof (Input[I]) == \`undefined\` || Input[I] == undefined) console.log (\`Error at ${Prepare_Text(Unformat(Expression))}: \${[${Expression.slice(1).map(E => `\`${Prepare_Text(Unformat(E))}\``).join(`, `)}][I]} is None.${Path.length > 0 ? `\\n    ${Context}` : ``}${typeof (Expression[1]) == `string` ? (Expression[1].includes(`?`) ? `` : `\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}`) : (Expression[1][0] == `$` ? `\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}` : ``)}\`); Output = Output[Input[I]]; if ((typeof (Output) == \`undefined\` || Output == undefined) && I < Input.length - 1) console.log (\`Error at ${Prepare_Text(Unformat(Expression))}: Getting \${[${Expression.slice(1).map(E => `\`${Prepare_Text(Unformat(E))}\``).join(`, `)}][I]}, whose value is \${Unformat (Input[I], true)}, of \${I == 1 ? \`${Prepare_Text(Unformat(Expression[1]))}\` : \`(. ${Prepare_Text(Unformat(Expression[1]))} \${Input.slice (0, I - 1).map (E => Unformat (E, true)).join (\` \`)})\`} results in None.${Path.length > 0 ? `\\n    ${Context}${typeof (Expression[1]) == `string` ? (Expression[1].includes(`?`) ? `` : `\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}`) : (Expression[1][0] == `$` ? `\${Object.keys (Abyss).includes (\`${Abyssal_Index}\`) ? Abyss[\`${Abyssal_Index}\`] : \`\\n     Reason: ${Abyssal_Index} has been undeclared during this iteration.\`}` : ``)}` : ``}\`) }; return Output })(${typeof (Expression[1]) == `string` ?
                                (Expression[1].includes(`?`) || Expression[1].endsWith(`@`) ? Values[1] : `\`${Expression[1]}\``) : (typeof (Expression[1]) == `object` ?
                                    (Expression[1][0] == `$` ?
                                        Convert(Expression[1][1], References, Warning, Warnings, Count, Path)[0] : Convert(Expression[1], References, Warning, Warnings, Count, Path)[0]) : Values[1])}${Expression.length > 2 ?
                                            `, ` + Expression.slice(2).map(E => Convert(E, References, Warning, Warnings, Count, Path)[0]).join(`, `) : ``})`
                    break
                }
                case `[]`: { Return_Value = `[${Values.slice(1).join(`, `)}]`; break }
                case `Mod`: { Return_Value = Values.length == 1 ? `0` : `[${Values.slice(1).join(`, `)}].reduce ((A, B) => Positive_Modulus (A, B))`; break }
                case `+`: { Return_Value = Values.length == 1 ? `0` : `[${Values.slice(1).join(`, `)}].reduce ((A, B) => A + B)`; break }
                case `-`: { Return_Value = Values.length == 1 ? `0` : (Values.length == 2 ? `(-${Values[1]})` : `[${Values.slice(1).join(`, `)}].reduce ((A, B) => A - B)`); break }
                case `*`: { Return_Value = Values.length == 1 ? `1` : `[${Values.slice(1).join(`, `)}].reduce ((A, B) => A * B)`; break }
                case `/`: { Return_Value = Values.length == 1 ? `1` : `[${Values.slice(1).join(`, `)}].reduce ((A, B) => A / B)`; break }
                case `^`: { Return_Value = Values.length == 1 ? `1` : `[${Values.slice(1).join(`, `)}].reduce ((A, B) => Math.pow (A, B))`; break }
                case `Ln`: { Return_Value = `Math.log (${Values[1]})`; break }
                case `Log`: { Return_Value = `Math.log (${Values[1]}) / Math.log (${Values[2]})`; break }
                case `Exp`: { Return_Value = `Math.exp (${Values[1]})`; break }
                case `Sin`: { Return_Value = `Math.sin (${Values[1]} / 180 * Math.PI)`; break }
                case `Cos`: { Return_Value = `Math.cos (${Values[1]} / 180 * Math.PI)`; break }
                case `Tan`: { Return_Value = `Math.tan (${Values[1]} / 180 * Math.PI)`; break }
                case `Arcsin`: { Return_Value = `Math.asin (${Values[1]}) / Math.PI * 180`; break }
                case `Arccos`: { Return_Value = `Math.acos (${Values[1]}) / Math.PI * 180`; break }
                case `Arctan`: { Return_Value = `Math.atan (${Values[1]}) / Math.PI * 180`; break }
                case `\\_`: { Return_Value = `Math.floor (${Values[1]})`; break }
                case `\\_/`: { Return_Value = `Math.round (${Values[1]})`; break }
                case `\\__/`: { Return_Value = `Math.round (${Values[1]} * Math.pow (10, ${Values[2] || 1})) / Math.pow (10, ${Values[2] || 1})`; break }
                case `_/`: { Return_Value = `Math.ceil (${Values[1]})`; break }
                case `||`: { Return_Value = `Math.abs (${Values[1]})`; break }
                case `&`: { Return_Value = `[${Values.slice(1).join(`, `)}].reduce ((A, B) => A && B, true)`; break }
                case `|`: { Return_Value = `[${Values.slice(1).join(`, `)}].reduce ((A, B) => A || B, false)`; break }
                case `->`: { Return_Value = `(${Values[1]} ?? ${Values[2]})`; break }
                case `~`: { Return_Value = `! (${Values[1]})`; break }
                case `=`: { Return_Value = Call(`((JSON.stringify (Results[0]) == JSON.stringify (Results[1]) && typeof (Results[0]) == typeof (Results[1])) || (Results[0] == undefined && Results[1] == undefined) || (Results[0] == undefined && Results[1] == undefined))`, Values.slice(1)); break }
                case `~=`: { Return_Value = Call(`((JSON.stringify (Results[0]) != JSON.stringify (Results[1]) || typeof (Results[0]) != typeof (Results[1])) && (Results[0] != undefined || Results[1] != undefined) && (Results[0] != undefined || Results[1] != undefined))`, Values.slice(1)); break }
                case `<=`: { Return_Value = `(${Values[1]} <= ${Values[2]})`; break }
                case `>=`: { Return_Value = `(${Values[1]} >= ${Values[2]})`; break }
                case `<`: { Return_Value = `(${Values[1]} < ${Values[2]})`; break }
                case `>`: { Return_Value = `(${Values[1]} > ${Values[2]})`; break }
                case `\\/`: { Return_Value = Call(`Math.max (...Results)`, Values.slice(1)); break }
                case `/\\`: { Return_Value = Call(`Math.min (...Results)`, Values.slice(1)); break }
                case `|||`: { Return_Value = `Mirror (${Values[1]})`; break }
                case `?`: { Return_Value = `Math.random ()`; break }
                case `$`: { Return_Value = `State[${Values[1]}]`; break }
                case `|-`: { Return_Value = `{ if (${Values[1]}) { ${Values[2]} }${Values.length <= 3 ? `` : ` else { ` + Values[3] + ` }`} }`; break }
                case `@`: { Return_Value = `{ while (${Values[1]}) { ${Values[2]} } }`; break }
                case `|=`: { Return_Value = `(${Values[1]} ? ${Values[2]} : ${Values[3]})`; break }
                case `-<`: { Return_Value = `{ switch (${Values[1]}) { ${Values.slice(3).map((Value, Index) => Index % 2 == 0 ? `case ${Value}: {` : `${Value}; break }`).join(``)} default: { ${Values[2]}; break } } }`; break }
                case `#`: { Return_Value = `Object.keys (${Values[1]}).length`; break }
                case `|>`: { Return_Value = `{ ${Values.slice(1).join(`;\n`)} }`; break }
                case `:`: { Return_Value = Call(`([... new Array (Math.max (Results[1] - Results[0], 0)).keys ()].map (Result => Result + Results[0]))`, Values.slice(1)); break }
                case `...`: { Return_Value = `...Object.values (${Values[1]})`; break }
                case `>>`: { Return_Value = `return ${Values[1]}`; break }
                case `:!:`: { Return_Value = `performance.now ()`; break }
                case `:?:`: { Return_Value = `(new Date () - 0)`; break }
                case `[~]`: { Return_Value = Values.length > 1 ? `(console.dir (${Values[1]}, { depth: undefined }))` : `(console.log ())`; break }
                case `[@]`: { Return_Value = `{ let End = performance.now (); console.log (${Values[1]} + \`: \${End - Start}\`); Start = End }`; break }
            }
            let Return_Type = `None`
            switch (Values[0]) {
                case `::`: { Return_Type = [`Any`, `String`]; break }
                case `.%`: { Return_Type = [`Any`, `Number`]; break }
                case `.:`: { Return_Type = [`String`, `*`]; break }
                case `.?`: { Return_Type = `Any`; break }
                case `:.`: { Return_Type = [`Any`, `*`]; break }
                case `{:}`: { Return_Type = `Any`; break }
                case `{+}`: { Return_Type = `Any`; break }
                case `{-}`: { Return_Type = `Any`; break }
                case `{_}`: { Return_Type = `Any`; break }
                case `{}`: { Return_Type = [[`Any`, `*`], `->`, `Any`]; break }
                case `=~`: { Return_Type = [`String`, `*`]; break }
                case `<>`: { Return_Type = [`Any`, [`Any`, `*`]]; break }
                case `<2>`: { Return_Type = [`Any`, [`Any`, `*`]]; break }
                case `<><>`: { Return_Type = Types[1] || `Any`; break }
                case `<%>`: { Return_Type = Types[1] || `Any`; break }
                case `<Q>`: { Return_Type = Values.length >= 4 && Values % 2 == 0 ? [... new Array((Values.length - 2) / 2).keys()].map(I => Types[2 * I + 2] || `None`) : `None`; break }
                case `<?>`: { Return_Type = Types[1] || `Any`; break }
                case `<0?>`: { Return_Type = `Any`; break }
                case `<!>`: { Return_Type = Types[1] || `Any`; break }
                case `<#>`: { Return_Type = Types[1] || `Any`; break }
                case `<|>`: { Return_Type = (typeof (Types[1]) == `object` ? [...Unique([...Types[1].slice(0, -1), ...(Types[3] == `None` ? [] : [Types[3]])]), `*`] : `Any`) || `Any`; break }
                case `<+>`: { Return_Type = (typeof (Types[1]) == `object` ? [...Unique([...Types[1].slice(0, -1), ...(Types[2] == `None` ? [] : [Types[2]])]), `*`] : `Any`); break }
                case `<__>`: { Return_Type = Types[1] || `Any`; break }
                case `<->`: { Return_Type = Types[1] || `Any`; break }
                case `<...>`: { Return_Type = Types.length == 3 && typeof (Types[2]) == `object` ? Types[2][2] : `Any`; break }
                case `<@>`: { Return_Type = `Boolean`; break }
                case `<-+>`: { Return_Type = Types[1] || `Any`; break }
                case `<<>>`: { Return_Type = `Any`; break }
                case `<_>`: { Return_Type = `Any`; break }
                case `<F>`: { Return_Type = `String`; break }
                case `<||>`: { Return_Type = `String`; break }
                case `<.>`: { Return_Type = `Any`; break }
                case `<~>`: { Return_Type = Types[1] || `None`; break }
                case `|~|`: { Return_Type = [`String`, `*`]; break }
                case `|#|`: { Return_Type = `String`; break }
                case `|@|`: { Return_Type = [`Any`, `*`]; break }
                case `|\\_|`: { Return_Type = `String`; break }
                case `|_/|`: { Return_Type = `String`; break }
                case `|->|`: { Return_Type = `Boolean`; break }
                case `|<-|`: { Return_Type = `Boolean`; break }
                case `:=`: { Return_Type = Types[2] || `None`; break }
                case `_`: { Return_Type = `None`; break }
                case `.\\`: { Return_Type = [Values.length == 2 ? [`Any`, `*`] : Expression.slice(2), `->`, Types[1]]; break }
                case `.`: { Return_Type = `Any`; break }
                case `[]`: { Return_Type = Values.length == 1 ? [`Any`, `*`] : [...Unique(Types.slice(1)), `*`]; break }
                case `Mod`: { Return_Type = `Number`; break }
                case `+`: { Return_Type = `Number`; break }
                case `-`: { Return_Type = `Number`; break }
                case `*`: { Return_Type = `Number`; break }
                case `/`: { Return_Type = `Number`; break }
                case `^`: { Return_Type = `Number`; break }
                case `Ln`: { Return_Type = `Number`; break }
                case `Log`: { Return_Type = `Number`; break }
                case `Exp`: { Return_Type = `Number`; break }
                case `Sin`: { Return_Type = `Number`; break }
                case `Cos`: { Return_Type = `Number`; break }
                case `Tan`: { Return_Type = `Number`; break }
                case `Arcsin`: { Return_Type = `Number`; break }
                case `Arccos`: { Return_Type = `Number`; break }
                case `Arctan`: { Return_Type = `Number`; break }
                case `\\_`: { Return_Type = `Number`; break }
                case `\\_/`: { Return_Type = `Number`; break }
                case `\\__/`: { Return_Type = `Number`; break }
                case `_/`: { Return_Type = `Number`; break }
                case `||`: { Return_Type = `Boolean`; break }
                case `&`: { Return_Type = `Boolean`; break }
                case `|`: { Return_Type = Types.every(Type => Type == `Boolean`) ? `Boolean` : Types.at(-1); break }
                case `->`: { Return_Type = `Any`; break }
                case `~`: { Return_Type = `Boolean`; break }
                case `=`: { Return_Type = `Boolean`; break }
                case `~=`: { Return_Type = `Boolean`; break }
                case `<=`: { Return_Type = `Boolean`; break }
                case `>=`: { Return_Type = `Boolean`; break }
                case `<`: { Return_Type = `Boolean`; break }
                case `>`: { Return_Type = `Boolean`; break }
                case `\\/`: { Return_Type = Types[1] || `None`; break }
                case `/\\`: { Return_Type = Types[1] || `None`; break }
                case `|||`: { Return_Type = Types[1] || `None`; break }
                case `?`: { Return_Type = `Number`; break }
                case `$`: { Return_Type = `Any`; break }
                case `|-`: { Return_Type = `None`; break }
                case `@`: { Return_Type = `None`; break }
                case `|=`: { Return_Type = `Any`; break }
                case `-<`: { Return_Type = `None`; break }
                case `#`: { Return_Type = `Number`; break }
                case `|>`: { Return_Type = typeof (Expression) == `object` ? (Expression.at(-1)[0] == `>>` ? Types.at(-1) || `None` : `None`) : `None`; break }
                case `:`: { Return_Type = [`Number`, `*`]; break }
                case `...`: { Return_Type = [Types[1] || `None`, `...`]; break }
                case `>>`: { Return_Type = Types[1] || `None`; break }
                case `:!:`: { Return_Type = `Number`; break }
                case `:?:`: { Return_Type = `Number`; break }
                case `[~]`: { Return_Type = `None`; break }
                case `[@]`: { Return_Type = `None`; break }
            }
            if (Values[0] == `:=` && typeof (Expression[1]) == `string`) References[Expression[1].split(`::`)[0]] = Types[2]
            if (!Literal) Warnings.push(Expression)
            //if (Unformatted.length >= 416) File_System.appendFileSync(`Cache`, Literal_Unformat(Expression) + `\r\n` + Return_Value + `\r\n` + JSON.stringify(Return_Type) + `\r\n\r\n`)
            return [Return_Value, Return_Type]
        }
        if (typeof (Expression[0]) == `string` && !Expression[0].includes(`?`)) {
            if (!Literal) Warnings.push(Expression)
        } else if (!Literal && Warning && ((Types.slice(1).some((T, I) => JSON.stringify(T) != JSON.stringify(((Types[0] || [])[0] || [])[I])) || ((Types[0] || [])[0] || []).some((T, I) => JSON.stringify(T) != JSON.stringify(Types[I + 1]))) && JSON.stringify((Types[0] || [])[0]) != JSON.stringify([`Any`, `*`]))) console.log(`Warning: There is a type mismatch with regard to ${Unformat(Expression[0], false, 512)} and its arguments.`)
        let Return_Value = Call(`Results[0] (...Results.slice (1))`, Values)
        let Return_Type = ((typeof (Types[0]) == `object` ? Types[0] : [undefined, undefined, `Any`]) || [undefined, undefined, `None`])[2]
        //if (Unformatted.length >= 416) File_System.appendFileSync(`Cache`, Literal_Unformat(Expression) + `\r\n` + Return_Value + `\r\n` + JSON.stringify(Return_Type) + `\r\n\r\n`)
        return [Return_Value,]
    } else {
        let [Value, Type] = Expression == `::` ? [`::`, undefined] : Expression.split(`::`)
        let Split_Expression = Value.split(`?`)
        if (Type == undefined) {
            if (!isNaN(Value)) Type = `Number`
            if (Value.toLowerCase() == `true` || Value.toLowerCase() == `false`) Type = `Boolean`
            if (Value.endsWith(`\``)) Type = `String`
            if (Value.toLowerCase() == `none`) Type = `None`
            if (Value.includes(`?`) && Value != `?`) Type = `Any`
            if (Object.keys(References).includes(Value)) Type = References[Value]
        }
        return [Functions.includes(Value) || Value.endsWith(`\``) || !isNaN(Value) ? Value :
            (Value.toLowerCase() == `true` || Value.toLowerCase() == `false` ? Value.toLowerCase() :
                (Value.endsWith(`@`) ? `Type_${Count - Value.slice(0, -1)}` :
                    (Value.toLowerCase() == `none` ? `undefined` :
                        (Split_Expression.length >= 2 ? (Value.startsWith(`...?`) ? `...Arguments_${Count - (Split_Expression.at(-1) == `` ? 1 : Split_Expression.at(-1))}` :
                            Value.startsWith(`??`) ? `Arguments_${Count - (Split_Expression.at(-1) == `` ? 1 : Split_Expression.at(-1))}` :
                                `Arguments_${Count - (Split_Expression.at(-1) == `` ? 1 : Split_Expression.at(-1))}[${Split_Expression[0] - 1}]`) :
                            `State[\`${Value}\`]`)))), Type]
    }
}
function Compile(Data, Warning, Write = false) {
    let References = {
        '::': [[`Any`], `->`, `String`],
        '.%': [[`Any`], `->`, `Number`],
        '.:': [[`Any`], `->`, `Any`],
        '.?': [[`Any`, `Any`], `->`, `Any`],
        ':.': [[`Any`, `String`, `*`], `->`, `Any`],
        '{:}': [[`Any`, `Any`], `->`, `Any`],
        '{+}': [[`Any`, `Any`], `->`, `Any`],
        '{-}': [[`Any`, `Any`], `->`, `Any`],
        '{_}': [[`Any`, `Any`], `->`, `Any`],
        '{}': [[`Any`, `*`], `->`, `Any`],
        '=~': [[`Any`], `->`, `Any`],
        '<>': [[`Any`], `->`, `Any`],
        '<2>': [[`Any`], `->`, `Any`],
        '<><>': [[[`Any`, `*`]], `->`, `Any`],
        '<%>': [[[`Any`, `*`], `Any`], `->`, `Any`],
        '<Q>': [[[`Any`, `*`], `Boolean`, `Any`, `*`], `->`, `Any`],
        '<?>': [[[`Any`, `*`]], `->`, `Any`],
        '<0?>': [[[`Any`, `*`]], `->`, `Any`],
        '<!>': [[[`Any`, `*`]], `->`, `Any`],
        '<#>': [[[`Any`, `*`], `Any`], `->`, `Any`],
        '<|>': [[[`Any`, `*`], `Number`, `*`], `->`, `Any`],
        '<+>': [[[`Any`, `*`], `Any`, `*`], `->`, `Any`],
        '<__>': [[[`Any`, `*`]], `->`, `Any`],
        '<->': [[[`Any`, `*`], `Any`, `*`], `->`, `Any`],
        '<...>': [[[`Any`, `*`], `Any`, `*`], `->`, `Any`],
        '<@>': [[[`Any`, `*`], `Any`], `->`, `Any`],
        '<-+>': [[[`Any`, `*`], `Any`, `*`], `->`, `Any`],
        '<<>>': [[[`Any`, `*`], `Any`, `Any`], `->`, `Any`],
        '<_>': [[[`Any`, `*`]], `->`, `Any`],
        '<F>': [[[`Any`, `*`], `String`, `*`], `->`, `Any`],
        '<||>': [[[`Any`, `*`], `String`], `->`, `Any`],
        '<.>': [[[`Any`, `*`], `Number`], `->`, `Any`],
        '<~>': [[[`Any`, `*`], `Number`, `*`], `->`, `Any`],
        '|~|': [[`String`, `String`], `->`, `Any`],
        '|#|': [[`String`, `String`, `String`], `->`, `Any`],
        '|@|': [[`String`, `String`], `->`, `Any`],
        '|\\_|': [[`String`], `->`, `String`],
        '|_/|': [[`String`], `->`, `String`],
        '|->|': [[`String`, `String`], `->`, `Boolean`],
        '|<-|': [[`String`, `String`], `->`, `Boolean`],
        ':=': [[`Any`, `*`], `->`, `Any`],
        '_': [[`Any`], `->`, `Any`],
        '.\\': [[`Any`, `*`], `->`, `Any`],
        '.': [[`Any`, `String`, `*`], `->`, `Any`],
        '[]': [[`Any`, `*`], `->`, `Any`],
        'Mod': [[`Number`, `Number`], `->`, `Any`],
        '+': [[`Number`, `String`, `*`], `->`, `Any`],
        '-': [[`Number`, `*`], `->`, `Any`],
        '*': [[`Number`, `*`], `->`, `Any`],
        '/': [[`Number`, `*`], `->`, `Any`],
        '^': [[`Number`, `Number`], `->`, `Any`],
        'Ln': [[`Number`], `->`, `Any`],
        'Log': [[`Number`, `Number`], `->`, `Any`],
        'Exp': [[`Number`], `->`, `Any`],
        'Sin': [[`Number`], `->`, `Any`],
        'Cos': [[`Number`], `->`, `Any`],
        'Tan': [[`Number`], `->`, `Any`],
        'Arcsin': [[`Number`], `->`, `Any`],
        'Arccos': [[`Number`], `->`, `Any`],
        'Arctan': [[`Number`], `->`, `Any`],
        '\\_': [[`Number`], `->`, `Any`],
        '\\_/': [[`Number`], `->`, `Any`],
        '\\__/': [[`Number`, `*`], `->`, `Any`],
        '_/': [[`Number`], `->`, `Any`],
        '||': [[`Number`], `->`, `Any`],
        '&': [[`Boolean`, `*`], `->`, `Any`],
        '|': [[`Boolean`, `*`], `->`, `Any`],
        '->': [[`Any`], `->`, `Any`],
        '~': [[`Boolean`], `->`, `Any`],
        '=': [[`Any`, `Any`], `->`, `Any`],
        '~=': [[`Any`, `Any`], `->`, `Any`],
        '<=': [[`Number`, `Number`], `->`, `Any`],
        '>=': [[`Number`, `Number`], `->`, `Any`],
        '<': [[`Number`, `Number`], `->`, `Any`],
        '>': [[`Number`, `Number`], `->`, `Any`],
        '\\/': [[`Any`, `*`], `->`, `Any`],
        '/\\': [[`Any`, `*`], `->`, `Any`],
        '|||': [[`Any`], `->`, `Any`],
        '?': [[], `->`, `Any`],
        '$': [[`String`, `Number`, `*`], `->`, `Any`],
        '|-': [[`Boolean`, `Any`, `*`], `->`, `Any`],
        '@': [[`Boolean`, `Any`], `->`, `Any`],
        '|=': [[`Boolean`, `Any`, `Any`], `->`, `Any`],
        '-<': [[`Any`, `*`], `->`, `Any`],
        '#': [[`Any`, `*`], `->`, `Any`],
        '|>': [[`Any`, `*`], `->`, `Any`],
        ':': [[`Number`, `Number`], `->`, `Any`],
        '...': [[`Any`, `*`], `->`, `Any`],
        '>>': [[`Any`], `->`, `Any`],
        ':!:': [[], `->`, `Any`],
        ':?:': [[], `->`, `Any`],
        '[~]': [[`String`], `->`, `Any`],
        '[@]': [[`String`], `->`, `Any`]
    }
    let Warnings = []
    let Code = `let Start = performance.now();\nlet Abyss = { };\n` + Convert(Format(`(|> ${Data})`), References, Warning, Warnings)[0]
    if (Warning) {
        for (let W of Warnings) if ((References[W[0]] || [])[1] == `->`) {
            let Types = References[W[0]][0]
            if (Types.at(-1) != `*`) {
                if (W.length - 1 < Types.length) {
                    console.log(`Warning at ${Unformat(W, false, 512)}: The provided arguments do not match the declared arity of ${Unformat(W[0], false, 512)}, which is ${Unformat(Types, false, 512)}.`)
                } else for (let I = 0; I < Types.length; I++) if (typeof (W[I + 1]) == `string`) {
                    let Type = (W[I + 1].startsWith(`\``) ? `String` : (!isNaN(W[I + 1]) ? `Number` : (W[I + 1].includes(`?`) ? Types[I] : References[W[I + 1]]))) || (W[I + 1] == `None` ? `None` : `Any`)
                    if (!Match_Types(Type, Types[I])) {
                        console.log(`Warning at ${Unformat(W, false, 512)}: The type of the ${Format_Ordinal(I + 1)} argument, which is ${Unformat(Type)}, does not match the declared type of ${Unformat(W[0], false, 512)}, which is ${Unformat(Types[I])}.`)
                    }
                }
            }
        } else if (!Functions.includes(W[0])) console.log(`Warning at ${Unformat(W)}: ${Unformat(W[0], true)} is not a compiled function.`)
    }
    if (Write) File_System.writeFileSync(`./References.json`, JSON.stringify(References))
    return Code
}
exports.Transpile = function (Code, Warning = false, Write = false) {
    let Output = `${Format_List.toString()}
    ${Type.toString()}
    ${Mirror.toString()}
    ${Unique.toString()}
    ${Shuffle.toString()}
    ${Positive_Modulus.toString()}
    ${Filter.toString()}
    ${Shorten.toString()}
    ${Prepare.toString()}
    ${Format.toString()}
    ${Generate.toString()}
    ${Unformat.toString()}
    ${Choose.toString()}
    ${Compile(Code, Warning, Write)}`
    return Output
}
exports.Execute = function (Code, State, Warning = false, Write = false) {
    let JavaScript = Compile(Code, Warning, Write)
    eval(JavaScript)
    return State
}
let Functions = [`::`, `.%`, `.:`, `.?`, `:.`, `{:}`, `{+}`, `{-}`, `{_}`, `{}`, `=~`, `<>`, `<2>`, `<><>`, `<%>`, `<Q>`, `<?>`, `<0?>`, `<!>`, `<#>`, `<|>`, `<+>`, `<__>`, `<->`, `<...>`, `<@>`, `<-+>`, `<<>>`, `<_>`, `<F>`, `<||>`, `<.>`, `<~>`, `|~|`, `|#|`, `|@|`, `|\\_|`, `|_/|`, `|->|`, `|<-|`, `:=`, `_`, `.\\`, `.`, `[]`, `Mod`, `+`, `-`, `*`, `/`, `^`, `Ln`, `Log`, `Exp`, `Sin`, `Cos`, `Tan`, `Arcsin`, `Arccos`, `Arctan`, `\\_`, `\\_/`, `\\__/`, `_/`, `||`, `&`, `|`, `->`, `~`, `=`, `~=`, `<=`, `>=`, `<`, `>`, `\\/`, `/\\`, `|||`, `?`, `$`, `|-`, `@`, `|=`, `-<`, `#`, `|>`, `:`, `...`, `>>`, `:!:`, `:?:`, `[~]`, `[@]`]
let File_System = require(`fs`)
let Buffer = ``//File_System.readFileSync(`Cache`).toString()
let Cache = {}
function Load_Cache() {
    let Buffer_Index = 0
    for (let I = 0; I < Buffer.length; I++) {
        if (Buffer[I - 3] == `\r` && Buffer[I - 2] == `\n` && Buffer[I - 1] == `\r` && Buffer[I] == `\n`) {
            let Data = Buffer.slice(Buffer_Index, I - 3).split(`\r\n`).slice(0, 3)
            Cache[Data[0]] = [Data[1], JSON.parse(Data[2])]
            Buffer_Index = I + 1
        }
    }
}
//console.log(`The cache is being loaded.`)
//Load_Cache()
//let Reversed_Keys = Object.keys(Cache).reverse()
//console.log(`The cache has been loaded.`)
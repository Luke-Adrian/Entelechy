let Engine = require(`./Transpiler.js`)

let S = {}

Engine.Execute(`(:= A 1)`, S) // We assign 1 to A.

console.log(S)

Engine.Execute(`(:= B (+ A 1))`, S) // We assign A+1 to B.

console.log(S)

Engine.Execute(`(<#> (: 0 10) (.\\ ([~] 1?)))`, S) // We map over the range from 0 to 10 (exclusive on the right side) and print out its values.

Engine.Execute(`(:= C (<2> ([] 1 ([] 2 3) 4)))`, S) // We print out a pair that consists of the list (1, 2, 3) and its abstract syntax tree, which can be used for metalinguistic purposes, such as translating the language into another one.

console.log(S)

Engine.Execute(`
(:= Primitive-Grammar (.\\ (-< 1? (>> 1?) \`1\` (>> \`One\`) \`2\` (>> \`Two\`) \`3\` (>> \`Three\`) \`4\` (>> \`Four\`))))
(:= Structure-Grammar (.\\ (+ (<F> (<~> 1? 1)))))
([~] (<<>> (. C 1) Primitive-Grammar Structure-Grammar))`, S) // We use the AST of C to generate a string.

Engine.Execute(`([~] (<Q> True (: 0 2) True (: 0 2) (.\\ (<= 1? 2?))))`, S) // We try processing the satisfiers of the following first-order sentence: For all *x* in {0, 1}, for all *y* in {0, 1}, *x* <= *y*. Here, there are no satisfiers.

Engine.Execute(`([~] (<Q> False (: 0 2) True (: 0 2) (.\\ (<= 1? 2?))))`, S) // We try processing the satisfiers of the following first-order sentence: There is an *x* in {0, 1} such that for all *y* in {0, 1}, *x* <= *y*. Here, (0, 0) and (0, 1) are satisfiers.
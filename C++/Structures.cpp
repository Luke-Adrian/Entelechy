#include <math.h>

#include <fstream>
#include <iostream>
#include <set>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;
enum Type { None, String, Number, Object, Function };
struct Structure {
    Type Type = None;
    double Double_Value;
    string String_Value;
    Structure (*Function_Pointer)(vector<Structure>);
    unordered_map<string, unsigned int> Keys;
    vector<Structure> Values;
};
vector<vector<Structure>> Arguments;
string Get_Type(Type Input) {
    switch (Input) {
        case String:
            return "String";
        case Number:
            return "Number";
        case Object:
            return "Object";
        case Function:
            return "Function";
        default:
            return "None";
    }
}
string JSON(Structure Input) {
    string Output = "";
    switch (Input.Type) {
        case Object: {
            Output = "{";
            if (Input.Values.size() > 0) {
                auto Key = Input.Keys.begin();
                Output += " \"" + (*Key).first +
                          "\": " + JSON(Input.Values[(*Key).second]);
                Key++;
                while (Key != Input.Keys.end()) {
                    Output += ", \"" + (*Key).first +
                              "\": " + JSON(Input.Values[(*Key).second]);
                    Key++;
                }
            }
            return Output + " }";
        }
        case Number: {
            return to_string(Input.Double_Value);
        }
        case String: {
            return "\"" + Input.String_Value + "\"";
        }
        default: {
            return "null";
        }
    }
}
Structure Get(Structure Input, vector<Structure> Keys) {
    if (Keys.size() == 0) return Input;
    Input.Type = Object;
    auto Key = Keys.at(0);
    switch (Key.Type) {
        case Number: {
            Structure Output;
            if (Keys.size() == 1) {
                Output = *(Input.Values.begin() + round(Key.Double_Value));
            } else {
                Keys.erase(Keys.begin());
                Output = Get(*(Input.Values.begin() + round(Key.Double_Value)),
                             Keys);
            }
            return Output;
        }
        case String: {
            Input.Type = Object;
            Structure Output;
            if (Input.Keys.count(Key.String_Value) == 1) {
                auto Value_Index =
                    Input.Values.begin() + Input.Keys[Key.String_Value];
                if (Keys.size() == 1) {
                    Output =
                        *(Input.Values.begin() + Input.Keys[Key.String_Value]);
                } else {
                    Keys.erase(Keys.begin());
                    Output = Get(*Value_Index, Keys);
                }
            } else
                cout << "A number or string was not used to access a variable."
                     << endl;
            return Output;
        }
        default: {
            cout << "A number or string was not used to access a variable."
                 << endl;
            return Input;
        }
    }
}
Structure Set(Structure Input, vector<Structure> Keys, Structure Value) {
    if (Keys.size() == 0) return Value;
    Input.Type = Object;
    auto Key = Keys.at(0);
    switch (Key.Type) {
        case Number: {
            Structure Output;
            if (Keys.size() == 1) {
                Output = Value;
            } else {
                Keys.erase(Keys.begin());
                Output = Set(*(Input.Values.begin() + round(Key.Double_Value)),
                             Keys, Value);
            }
            if (round(Key.Double_Value) < Input.Values.size())
                Input.Values.erase(Input.Values.begin() +
                                   round(Key.Double_Value));
            Input.Values.insert(Input.Values.begin() + round(Key.Double_Value),
                                Output);
            Input.Keys[std::to_string(round(Key.Double_Value))] =
                round(Key.Double_Value);
            return Input;
        }
        case String: {
            Input.Type = Object;

            if (Input.Keys.count(Key.String_Value) == 1) {
                auto Value_Index =
                    Input.Values.begin() + Input.Keys[Key.String_Value];
                Structure Output;
                if (Keys.size() == 1) {
                    Output = Value;
                } else {
                    Keys.erase(Keys.begin());
                    Output = Set(*Value_Index, Keys, Value);
                }
                if (Input.Keys[Key.String_Value] < Input.Values.size())
                    Input.Values.erase(Value_Index);
                Input.Values.insert(Value_Index, Output);
            } else {
                Structure Output;
                if (Keys.size() == 1) {
                    Output = Value;
                } else {
                    Keys.erase(Keys.begin());
                    Structure Temporary;
                    Temporary.Type = Object;
                    Output = Set(Temporary, Keys, Value);
                }
                Input.Keys[Key.String_Value] = Input.Values.size();
                Input.Values.push_back(Output);
            }
            return Input;
        }
        default: {
            cout << "A number or string was not used to access a variable."
                 << endl;
            return Input;
        }
    }
}
Structure Remove(Structure Input, vector<Structure> Keys) {
    if (Keys.size() == 0) return Input;
    Input.Type = Object;
    auto Key = Keys.at(0);
    switch (Key.Type) {
        case Number: {
            if (Keys.size() == 1) {
                Input.Values.erase(Input.Values.begin() +
                                   round(Key.Double_Value));
                auto Current_Key = Input.Keys.begin();
                while (Current_Key != Input.Keys.end()) {
                    if ((*Current_Key).second == round(Key.Double_Value)) {
                        Input.Keys.erase(Current_Key);
                        auto Other_Key = Input.Keys.begin();
                        while (Other_Key != Input.Keys.end()) {
                            if ((*Other_Key).second > round(Key.Double_Value))
                                Input.Keys[(*Other_Key).first]--;
                            Other_Key++;
                        }
                        break;
                    }
                    Current_Key++;
                }
            } else {
                Keys.erase(Keys.begin());
                Input.Values[round(Key.Double_Value)] =
                    Get(Input.Values[round(Key.Double_Value)], Keys);
            }
            return Input;
        }
        case String: {
            Input.Type = Object;
            if (Input.Keys.count(Key.String_Value) == 1) {
                if (Keys.size() == 1) {
                    unsigned int Value_Index = Input.Keys[Key.String_Value];
                    Input.Keys.erase(Key.String_Value);
                    Input.Values.erase(Input.Values.begin() + Value_Index);
                    auto Other_Key = Input.Keys.begin();
                    while (Other_Key != Input.Keys.end()) {
                        if ((*Other_Key).second > Value_Index)
                            Input.Keys[(*Other_Key).first]--;
                        Other_Key++;
                    }
                } else {
                    Keys.erase(Keys.begin());
                    Input.Values[Input.Keys[Key.String_Value]] =
                        Get(Input.Values[Input.Keys[Key.String_Value]], Keys);
                }
            } else
                cout << "A number or string was not used to access a variable."
                     << endl;
            return Input;
        }
        default: {
            cout << "A number or string was not used to access a variable."
                 << endl;
            return Input;
        }
    }
}
Structure Form() {
    Structure Input;
    return Input;
}
Structure Form(string Value) {
    Structure Input;
    Input.Type = String;
    Input.String_Value = Value;
    return Input;
}
Structure Form(double Value) {
    Structure Input;
    Input.Type = Number;
    Input.Double_Value = Value;
    return Input;
}
Structure Form(Structure Value) {
    Structure Input;
    Input.Type = Value.Type;
    Input.String_Value = Value.String_Value;
    Input.Double_Value = Value.Double_Value;
    Input.Function_Pointer = Value.Function_Pointer;
    Input.Keys = Value.Keys;
    Input.Values = Value.Values;
    return Input;
}
Structure Form(vector<Structure> Values) {
    Structure Input;
    Input.Type = Object;
    for (auto Key = Values.begin(); Key != Values.end(); Key += 2)
        Input = Set(Input, vector<Structure>({*Key}), *(Key + 1));
    return Input;
}
Structure Form(Structure (*Function_Pointer)(vector<Structure>)) {
    Structure Input;
    Input.Type = Function;
    Input.Function_Pointer = Function_Pointer;
    return Input;
}
Structure Objectify(vector<Structure> Values) {
    Structure Input;
    Input.Type = Object;
    auto Key = Values.begin();
    double Index = 0.0;
    while (Key != Values.end()) {
        Input = Set(Input, vector<Structure>({Form(Index)}), *Key);
        Index++;
        Key++;
    }
    return Input;
}
Structure Range(Structure Start, Structure End) {
    Structure Output;
    Output.Type = Object;
    int Size = round(End.Double_Value) - round(Start.Double_Value);
    Output.Keys.reserve(Size);
    Output.Values.resize(Size);
    for (unsigned int I = 0; I < Size; I++) {
        Output.Keys[to_string(I)] = I;
        Output.Values[I] = Form(I + Start.Double_Value);
    }
    return Output;
}
Structure Map(Structure Input, Structure Function) {
    Structure Output = Form();
    Output.Type = Object;
    Output.Keys = Input.Keys;
    Output.Values.resize(Input.Values.size());
    auto Key = Input.Keys.begin();
    auto Value = Input.Values.begin();
    Arguments.insert(Arguments.begin(), vector<Structure>({Form()}));
    for (unsigned int I = 0; I + Value < Input.Values.end(); I++) {
        Arguments.front()[0] = *(Value + I);
        Output.Values[I] = (*Function.Function_Pointer)(Arguments.front());
    }
    Arguments.erase(Arguments.begin());
    return Output;
}
Structure Reduce(Structure Input, Structure Function) {
    Structure Output = *Input.Values.begin();
    vector<Structure> List;
    Arguments.insert(Arguments.begin(), List);
    for (auto Value = Input.Values.begin() + 1; Value != Input.Values.end();
         Value++) {
        Arguments.front() = vector<Structure>({Output, *Value});
        Output = (*Function.Function_Pointer)(Arguments.front());
    }
    Arguments.erase(Arguments.begin());
    return Output;
}
Structure Add(vector<Structure> Input) {
    Structure Output;
    if (Input.size() > 0) Output = Input[0];
    for (unsigned int I = 1; I < Input.size(); I++) {
        if (Output.Type == Input[I].Type && Output.Type == Number)
            Output.Double_Value += Input[I].Double_Value;
        if (Output.Type == Input[I].Type && Output.Type == String)
            Output.String_Value += Input[I].String_Value;
        if (Output.Type == Number && Input[I].Type == String)
            Output =
                Form(to_string(Output.Double_Value) + Input[I].String_Value);
        if (Output.Type == String && Input[I].Type == Number)
            Output =
                Form(Output.String_Value + to_string(Input[I].Double_Value));
    }
    return Output;
}
Structure Subtract(vector<Structure> Input) {
    Structure Output;
    if (Input.size() > 0) Output = Input[0];
    for (unsigned int I = 1; I < Input.size(); I++) {
        if (Output.Type == Input[I].Type && Output.Type == Number)
            Output.Double_Value -= Input[I].Double_Value;
    }
    return Output;
}
Structure Multiply(vector<Structure> Input) {
    Structure Output;
    if (Input.size() > 0) Output = Input[0];
    for (unsigned int I = 1; I < Input.size(); I++) {
        if (Output.Type == Input[I].Type && Output.Type == Number)
            Output.Double_Value *= Input[I].Double_Value;
        if (Output.Double_Value == 0.0) return Output;
    }
    return Output;
}
Structure Divide(vector<Structure> Input) {
    Structure Output;
    if (Input.size() > 0) Output = Input[0];
    for (unsigned int I = 1; I < Input.size(); I++) {
        if (Output.Type == Input[I].Type && Output.Type == Number)
            Output.Double_Value /= Input[I].Double_Value;
    }
    return Output;
}
Structure Or(vector<Structure> Input) {
    Structure Output;
    if (Input.size() > 0) Output = Input[0];
    for (unsigned int I = 1; I < Input.size(); I++) {
        if (Output.Type == Input[I].Type && Output.Type == Number)
            Output.Double_Value += Input[I].Double_Value;
        if (Output.Double_Value > 1.0) {
            Output.Double_Value = 1.0;
            return Output;
        }
    }
    return Output;
}
Structure Equal(vector<Structure> Input) {
    Structure Output;
    Output = Form(1.0);
    Structure Buffer;
    if (Input.size() > 0) Buffer = Input[0];
    for (unsigned int I = 1; I < Input.size(); I++) {
        if (Buffer.Type != Input[I].Type) {
            Output.Double_Value = 0.0;
            return Output;
        } else
            switch (Buffer.Type) {
                // { None, String, Number, Object, Function }
                case String: {
                    if (Buffer.String_Value != Input[I].String_Value) {
                        Output.String_Value = 0.0;
                        return Output;
                    }
                    break;
                }
                case Number: {
                    if (Buffer.Double_Value != Input[I].Double_Value) {
                        Output.Double_Value = 0.0;
                        return Output;
                    }
                    break;
                }
                case Object: {
                    for (auto Key : Buffer.Keys)
                        if (Input[I].Keys.find(Key.first) ==
                            Input[I].Keys.end()) {
                            Output.Double_Value = 0.0;
                            return Output;
                        }
                    for (auto Key : Input[I].Keys)
                        if (Buffer.Keys.find(Key.first) == Buffer.Keys.end()) {
                            Output.Double_Value = 0.0;
                            return Output;
                        }
                    
                    break;
                }
                case Function: {
                    if (Buffer.Function_Pointer != Input[I].Function_Pointer) {
                        Output.Double_Value = 0.0;
                        return Output;
                    }
                    break;
                }
            }
        Buffer = Input[I];
    }
    return Output;
}
vector<Structure> Prepare(vector<Structure> Input, set<unsigned int> Spreads) {
    vector<Structure> Output;
    unsigned int Size = 0;
    for (unsigned int I = 0; I < Input.size(); I++) {
        if (Spreads.count(I) == 1) {
            Size += Input[I].Values.size();
        } else
            Size++;
    }
    Output.resize(Size);
    unsigned int Index = 0;
    for (unsigned int I = 0; I < Input.size(); I++) {
        if (Spreads.count(I) == 1) {
            for (unsigned int J = 0; J < Input[I].Values.size(); J++)
                Output[Index++] = Input[I].Values[J];
        } else
            Output[Index++] = Input[I];
    }
    return Output;
}
string Trim(string Input) {
    string Output = "";
    unsigned int Start = 0;
    unsigned int End = Input.length() - 1;
    for (int I = 0; I < Input.length(); I++)
        if (Input[I] != ' ' && Input[I] != '\n') {
            Start = I;
            break;
        }
    for (int I = End; I >= 0; I--)
        if (Input[I] != ' ' && Input[I] != '\n') {
            End = I;
            break;
        }
    return Input.substr(Start, End - Start + 1);
}
string Read_File(string Name) {
    string Output = "";
    string Buffer = "";
    ifstream File_Reader(Name);
    while (getline(File_Reader, Buffer)) Output += Buffer;
    File_Reader.close();
    return Output;
}
Structure Parse_JSON(string Text) {
    string T = Trim(Text);
    switch (T[0]) {
        case '[': {
            T = "[" + Trim(T).substr(1, T.length() - 2) + "]";
            Structure Output;
            Output.Type = Object;
            vector<string> Elements;
            bool Quote = false;
            char A = ' ';
            char B = ' ';
            unsigned int Index = 1;
            for (unsigned int I = 1; I < T.length(); I++) {
                if (T[I] == '"' && (A != '\\' || B == '\\')) Quote = !Quote;
                if (!Quote) {
                    if ((T[I] == '[' || T[I] == '{') && I < T.length() - 1) {
                        char Close = ']';
                        if (T[I] == '{') Close = '}';
                        bool Inner_Quote = false;
                        char Inner_A = ' ';
                        char Inner_B = ' ';
                        unsigned int J = 0;
                        int Sum = 1;
                        for (J = I + 1; J < T.length(); J++) {
                            if (T[I] == '"' &&
                                (Inner_A != '\\' || Inner_B == '\\'))
                                Inner_Quote = !Inner_Quote;
                            if (!Inner_Quote)
                                if (T[J] == T[I]) {
                                    Sum++;
                                } else if (T[J] == Close)
                                    Sum--;
                            if (Sum == 0) break;
                            Inner_B = Inner_A;
                            Inner_A = T[J];
                        }
                        I = J + 1;
                    }
                    if (T[I] == ',' || (I == T.length() - 1 && Index != 1)) {
                        Elements.push_back(Trim(T.substr(Index, I - Index)));
                        Index = I + 1;
                    }
                }
                B = A;
                A = T[I];
            }
            for (unsigned int I = 0; I < Elements.size(); I++)
                Output = Set(Output, vector<Structure>{Form(to_string(I))},
                             Parse_JSON(Elements[I]));
            return Output;
        }
        case '{': {
            T = "{" + Trim(T).substr(1, T.length() - 2) + "}";
            Structure Output;
            Output.Type = Object;
            vector<string> Labels;
            vector<string> Elements;
            bool Quote = false;
            char A = ' ';
            char B = ' ';
            unsigned int Label_Index = -1;
            unsigned int Colon_Index = -1;
            for (unsigned int I = 1; I < T.length(); I++) {
                if (T[I] == '"' && (A != '\\' || B == '\\')) Quote = !Quote;
                if (Quote) {
                    if (Label_Index == -1) Label_Index = I;
                } else {
                    if ((T[I] == '[' || T[I] == '{') && I < T.length() - 1) {
                        char Close = ']';
                        if (T[I] == '{') Close = '}';
                        bool Inner_Quote = false;
                        char Inner_A = ' ';
                        char Inner_B = ' ';
                        unsigned int J = 0;
                        int Sum = 1;
                        for (J = I + 1; J < T.length(); J++) {
                            if (T[I] == '"' &&
                                (Inner_A != '\\' || Inner_B == '\\'))
                                Inner_Quote = !Inner_Quote;
                            if (!Inner_Quote)
                                if (T[J] == T[I]) {
                                    Sum++;
                                } else if (T[J] == Close)
                                    Sum--;
                            if (Sum == 0) break;
                            Inner_B = Inner_A;
                            Inner_A = T[J];
                        }
                        I = J + 1;
                    }
                    if ((T[I] == ',' || I >= T.length() - 1) &&
                        (Label_Index != -1 && Colon_Index != -1)) {
                        Labels.push_back(T.substr(
                            Label_Index + 1, Colon_Index - Label_Index - 2));
                        Elements.push_back(Trim(
                            T.substr(Colon_Index + 1, I - Colon_Index - 1)));
                        Label_Index = -1;
                        Colon_Index = -1;
                    } else if (T[I] == ':' && Label_Index != -1)
                        Colon_Index = I;
                }
                B = A;
                A = T[I];
            }
            for (unsigned int I = 0; I < Elements.size(); I++)
                Output = Set(Output, vector<Structure>{Form(Labels[I])},
                             Parse_JSON(Elements[I]));
            return Output;
        }
        case 'n':
            return Form();
        case 't':
            return Form(1.0);
        case 'f':
            return Form(0.0);
        case '"':
            return Form(T.substr(1, T.length() - 2));
        default:
            return Form(atof(T.c_str()));
    }
}

int main() { return 0; }
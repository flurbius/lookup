import { DefinitionFile } from "./definition-file";
import * as oed from './OED/oed-service';



export class Dictionary{
    
    static GetDefinitions(input:DefinitionFile):DefinitionFile{
        let clone = JSON.stringify(input);
        return JSON.parse(clone);
    }
}
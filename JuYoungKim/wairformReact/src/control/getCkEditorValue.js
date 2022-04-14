import HTMLReactParser from "html-react-parser";

export default function getCKEditorValue(content){
    return HTMLReactParser(content);
}
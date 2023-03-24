import Request from "@pagequit/hedis/dist/Request";

export default class HedisInteractionHandler {
    handle(request: Request): void {
        return console.log(request.data);
    }
}

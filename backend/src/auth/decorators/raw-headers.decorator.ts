import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest()
        return req.RawHeders
    }
)
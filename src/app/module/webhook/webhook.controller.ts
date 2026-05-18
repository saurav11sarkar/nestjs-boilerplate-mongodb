import { Controller, Post, Headers, Req, Res, HttpCode } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    return this.webhookService.handleWebhook(req.body as Buffer, sig, res);
  }
}

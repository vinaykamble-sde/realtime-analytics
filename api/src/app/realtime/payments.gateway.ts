import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  import { Logger } from '@nestjs/common';
  
  import { PaymentEventsService } from '../payments/payment-events.service';
  import { PaymentEvent } from '@org/shared-types';
  import { AnalyticsService } from '../analytics/analytics.service';
import { PaymentMetrics } from '@org/shared-types';
  
  @WebSocketGateway({
    namespace: '/payments',
    cors: {
      origin: '*',
    },
  })
  export class PaymentsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server!: Server;
  
    private readonly logger = new Logger(PaymentsGateway.name);
  
    constructor(
      private readonly paymentEventsService: PaymentEventsService,
      private readonly analyticsService: AnalyticsService,
    ) {}
  
    afterInit() {
        this.logger.log('Payments WebSocket Gateway initialized');
      
        this.paymentEventsService.stream$.subscribe(async (event) => {
          // Emit raw payment event
          this.server.emit('payment-event', event);
      
          // Recompute and emit updated metrics
          const metrics: PaymentMetrics =
            await this.analyticsService.getMetrics();
      
          this.server.emit('metrics-update', metrics);
        });
      }
  
    handleConnection(client: any) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: any) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }
  
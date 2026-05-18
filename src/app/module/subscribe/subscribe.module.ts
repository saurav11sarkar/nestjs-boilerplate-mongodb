import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscribe, SubscribeSchema } from './entities/subscribe.entity';
import { User, UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscribe.name, schema: SubscribeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService],
})
export class SubscribeModule {}

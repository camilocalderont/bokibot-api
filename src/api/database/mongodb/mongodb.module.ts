import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI),
    ],
    exports: [MongooseModule],
})
export class MongoDBModule {}
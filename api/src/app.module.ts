import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { IdeaController } from './idea/idea.controller';
import { IdeaService } from './idea/idea.service';
import { IdeaModule } from './idea/idea.module';

@Module({
  imports: [AuthModule, IdeaModule],
  controllers: [AppController, IdeaController],
  providers: [AppService, IdeaService],
})
export class AppModule {}

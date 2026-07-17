import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { IdeaController } from './idea/idea.controller';
import { IdeaService } from './idea/idea.service';
import { IdeaModule } from './idea/idea.module';
import { NotesController } from './notes/notes.controller';
import { NotesService } from './notes/notes.service';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [AuthModule, IdeaModule, NotesModule],
  controllers: [AppController, IdeaController, NotesController],
  providers: [AppService, IdeaService, NotesService],
})
export class AppModule {}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export type SafeUser = { id: string; email: string; createdAt: Date };

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async create(email: string, passwordHash: string): Promise<SafeUser> {
    try {
      const doc = await this.userModel.create({ email: email.toLowerCase(), passwordHash });
      return { id: doc.id, email: doc.email, createdAt: doc.createdAt };
    } catch (e: any) {
      // 11000 = duplicate key (índice unique de email)
      if (e?.code === 11000) throw new ConflictException('Email already registered');
      throw e;
    }
  }

  toSafe(doc: UserDocument): SafeUser {
    return { id: doc.id, email: doc.email, createdAt: doc.createdAt };
  }
}

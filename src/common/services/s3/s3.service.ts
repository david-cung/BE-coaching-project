import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3 = new S3Client({
    region: this.configService.get<string>('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    },
  });

  async generateUploadUrl(
    fileName: string,
  ): Promise<{ key: string; url: string }> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const fileKey = `posts/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: 'image/jpeg',
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    return { key: fileKey, url };
  }
}

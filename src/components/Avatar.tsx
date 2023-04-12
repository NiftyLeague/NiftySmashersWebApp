import React, { useState } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import { Database } from '../utils/database.types';
type Profiles = Database['public']['Tables']['profiles']['Row'];

import styles from '@/styles/profile.module.css';

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url: Profiles['avatar_url'];
  size: number;
  onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      // TODO: handle upload image to S3

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.avatarContainer}>
      {url ? (
        <Image
          src={url}
          alt="Avatar"
          className={cn(styles.avatar, styles.image)}
          height={size}
          width={size}
        />
      ) : (
        <div
          className={cn(styles.avatar, styles.no_image)}
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label
          className={cn(styles.button, styles.primary, 'block')}
          htmlFor="single"
        >
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}

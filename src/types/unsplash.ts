export interface UnsplashUser {
  id: string;
  name: string;
  username: string;
  profile_image: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  color: string | null;
  description: string | null;
  alt_description: string | null;
  created_at: string;
  likes: number;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: UnsplashUser;
}

export interface UnsplashTag {
  type: string;
  title: string;
}

export interface UnsplashPhotoDetails extends UnsplashPhoto {
  tags: UnsplashTag[];
  downloads?: number;
  views?: number;
  location?: {
    name: string | null;
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

export interface PhotosPage {
  photos: UnsplashPhoto[];
  totalPages: number;
  total: number;
}

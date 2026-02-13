export interface Tag {
  name: string;
  slug: string;
  color: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface TagDocument extends Tag {
  _id: string;
}

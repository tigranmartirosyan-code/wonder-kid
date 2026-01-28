export class CreateBlogDto {
  title: string;
  description: string;
  image: string;
  category: string;
  date: Date; // Don't forget this one!
  categoryColor: string;
  categoryLabel: string;
}

import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  @Input('selected') selectedCategory: string;
  categories$: Observable<Category[]>;
  
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categories$ = this.getCategories();
  }

  getCategories(): Observable<Category[]> {
    return this.categoryService.getAll().snapshotChanges().pipe(
      map(categorySnapshots => {
        return categorySnapshots.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
      })
    )
  }

}

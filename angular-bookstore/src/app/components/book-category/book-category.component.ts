import { BookCategory } from './../../common/book-category';
import { BookService } from 'src/app/services/book.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})
export class BookCategoryComponent implements OnInit {

  bookCategories: BookCategory [];

  constructor(private _bookService: BookService) { }

  ngOnInit(): void {
    this.listBookCategory();
  }

  listBookCategory() {
    this._bookService.getBookCategories().subscribe(
      data => {
        console.log(data);
        this.bookCategories = data;
        console.log(this.bookCategories);
      }
    );
  }

}

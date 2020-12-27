import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-item';
import { BookService } from 'src/app/services/book.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from './../../common/book';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-books-details',
  templateUrl: './books-details.component.html',
  styleUrls: ['./books-details.component.css']
})
export class BooksDetailsComponent implements OnInit {

  book: Book = new Book();

  constructor(private _ativatedRoute: ActivatedRoute, private _bookService: BookService, private _cartService: CartService) { }

  ngOnInit(): void {
    this._ativatedRoute.paramMap.subscribe(
      () => {
        this.getBookInfo();
      }
    );
  }

  getBookInfo() {
    const id: number = +this._ativatedRoute.snapshot.paramMap.get('id');
    this._bookService.get(id).subscribe(
      data => {
        this.book = data;
      }
    );
  }

  addToCart() {
    const cartItem = new CartItem(this.book);
    this._cartService.addToCard(cartItem);
  }

}

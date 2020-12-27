import { CartItem } from './../../common/cart-item';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/common/book';
import { BookService } from 'src/app/services/book.service';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-book-list',
  //templateUrl: './book-list.component.html',
  templateUrl: './book-grid.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  books: Book[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  
  //new properties for server side pagging
  currentPage: number = 1;
  pageSize: number = 3;
  totalRecords: number = 0;
  previousCategory: number = 1;


  constructor(private _bookService: BookService, private _activatedRoute: ActivatedRoute, _config: NgbPaginationConfig, private _cartService: CartService, private _spinnerService: NgxSpinnerService) {
    _config.maxSize = 3;
    _config.boundaryLinks = true;
   }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(
        () => {
          this.listBooks();
        }
      );
  }

  

  /*
   * RECUPERER LA LISTE DES LIVRES DE LA BD 
   *EN APPELLANT LE BOOKSERVICE
   */
  listBooks() {
    //start the loader/spinner
    this._spinnerService.show();
    this.searchMode = this._activatedRoute.snapshot.paramMap.has('keyword');
    if(this.searchMode) {
      //do search work
      this.handleSearchBooks();
    } else {
      this.handleListBooks();
    }
  }

  handleListBooks() {
    const hasCategoryId: boolean = this._activatedRoute.snapshot.paramMap.has('id');
    
    if (hasCategoryId){
      this.currentCategoryId = +this._activatedRoute.snapshot.paramMap.get('id');
    } else{
      this.currentCategoryId = 1;
    }

    //setting up the current page to 1
    //if user navigates to other category
    if (this.previousCategory != this.currentCategoryId) {
      this.currentPage = 1;
    }

    this.previousCategory = this.currentCategoryId;

    this._bookService.getBooks(this.currentCategoryId,
         this.currentPage - 1,
         this.pageSize).subscribe(
        this.processPaginate());
  }

  handleSearchBooks() {
    const keyword: string = this._activatedRoute.snapshot.paramMap.get('keyword');
    this._bookService.searchBooks(keyword, this.currentPage - 1, this.pageSize).subscribe(
      this.processPaginate()
    );
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.listBooks();
  }

  processPaginate() {
    return data => {
      setTimeout(
        () => {
          //stops the spinner/loader
          this._spinnerService.hide();
          this.books = data._embedded.books;
          //page number starts from 1 index
          this.currentPage = data.page.number + 1;
          this.totalRecords = data.page.totalElements;
          this.pageSize = data.page.size;
        }, 2000);
    };
  }

  addToCart(book: Book) {
    console.log(`book name: ${book.name}, and price: ${book.unitPrice}`);
    const cartItem = new CartItem(book);
    this._cartService.addToCard(cartItem);
  }

}

import { BookCategory } from './../common/book-category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../common/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = "http://localhost:8080/api/v1/books";
  private categoryUrl = "http://localhost:8080/api/v1/book-category";

  constructor(private httpClient: HttpClient) { }
  /*
   * Fonction qui récupère les ressources fournies par baseURL
   * Ses ressources proviennent de la BD récupéré par le code JAVA
   */
  getBooks(theCategoryId: number, currentPage: number, pageSize: number): Observable<GetResponseBooks>{
    const searchUrl = `${this.baseUrl}/search/categoryid?id=${theCategoryId}&page=${currentPage}&size=${pageSize}`;
    //return this.getBookList(searchUrl);
    return this.httpClient.get<GetResponseBooks>(searchUrl);

  }

  private getBookList(searchUrl: string): Observable<Book[]> {
    return this.httpClient.get<GetResponseBooks>(searchUrl).pipe(
      map(response => response._embedded.books)
    );
  }

  getBookCategories(): Observable<BookCategory[]>  {
    return this.httpClient.get<GetResponseBookCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.bookCateogry)
    );
  }

  searchBooks(keyword: string, currentPage: number, pageSize: number): Observable<GetResponseBooks>{
    const searchUrl = `${this.baseUrl}/search/searchBykeyword?name=${keyword}&page=${currentPage}&size=${pageSize}`;
    return this.httpClient.get<GetResponseBooks>(searchUrl);
  }

  get(bookId: number) : Observable<Book> {
    const bookDetailsUrl = `${this.baseUrl}/${bookId}`;
    return this.httpClient.get<Book>(bookDetailsUrl);
  }
}

interface GetResponseBooks {

  _embedded: {
    books: Book[];
  };
  page: {
     //number of records in each page
    size: number;
    //total number of records in database
    totalElements: number;
    //total number of pages, starts from 0 index
    totalPages: number;
    //current page
    Number: number;

  }

}

interface GetResponseBookCategory {

  _embedded: {
    bookCateogry: BookCategory [];
  };

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // http://localhost:8080/api/products?size=100  <-- to show view data length
  private baseUrl = environment.baseUrl + '/products';

  private categoryUrl = environment.baseUrl + '/product-category';

  constructor(private httpClient: HttpClient) {
  }

  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {

    // build URL by category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // build URL by category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProduct(productId: number): Observable<Product> {

    // need URL based on on product id
    const productURL = `${this.baseUrl}/${productId}`;

    return this.httpClient.get<Product>(productURL);
  }

  searchProduct(theKeyWord: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.getProducts(searchUrl);
  }

  searchProductPaginate(thePage: number,
                        thePageSize: number,
                        theKeyword: string): Observable<GetResponseProducts> {

    // build URL by keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}

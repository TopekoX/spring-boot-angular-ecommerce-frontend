import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId!: number;
  currentCategoryName!: string;
  searchMode!: boolean;

  // properties fot pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousCategoryId: number = 1;
  currentlyCategoryId: number = 1;

  previousKeyword!: string;

  constructor(private productService: ProductService,
    private cartService: CartService,    
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProduct();
    }
    )
  }

  listProduct() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }
  }

  handleSearchProduct() {

    const theKeyWord = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previoes
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyWord) {
      this.thePageNumber = 1;
    }

    if (theKeyWord != null) {
      this.previousKeyword = theKeyWord;
      console.log(`keyword=${theKeyWord}, thePageNumber=${this.thePageNumber}`);
      
      // now search for the product
      this.productService.searchProductPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                theKeyWord).subscribe(this.processResult());
    }
  }

  handleListProduct() {
    // check id "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the id value
      const theId = this.route.snapshot.paramMap.get('id');

      // get the name value
      const theName = this.route.snapshot.paramMap.get('name');

      if (theId != null) {
        // get the "id" param string and convert string to a number use the "+" symbol
        this.currentCategoryId = +theId;

        if (theName != null) {
          this.currentCategoryName = theName;
        }
      }

    } else {
      // not category id available ... to category id 1
      this.currentCategoryId = 1;

      // not category name available ... to category id Books
      this.currentCategoryName = 'Books';
    }

    // Check if we have a diferent category than previous
    // Note: Angular will reuse a component if it is currently being viewed

    // if we have different category id then previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentlyCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, the pageNumber=${this.thePageNumber}`);

    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )

    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult())

  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProduct();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart : ${theProduct.name}, ${theProduct.unitPrice}`);

    // call service add cart
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}

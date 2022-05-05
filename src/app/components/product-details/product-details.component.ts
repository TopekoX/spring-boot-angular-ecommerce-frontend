import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product(); // must declarated, else error Race Condition
  productId!: number;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProduction();
    });
  }

  handleProduction() {
    const tempIdProduct = this.route.snapshot.paramMap.get('id');

    if(tempIdProduct != null) {
        // get id convert to number using "+"
        this.productId = +tempIdProduct;

        this.productService.getProduct(this.productId).subscribe(
          data => {
            this.product = data;
          }
        );
    }

  }

}

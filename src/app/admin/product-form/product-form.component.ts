import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from 'src/app/models/category';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { Product } from '../../models/product';
import { SnapshotAction } from '@angular/fire/database';
import { ProductService } from '../../services/product.service';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories: Category[] = [];
  file: File = null;
  files: File[] = [];
  imgError: string = null;
  priceError: string = null;
  uploadPercent$: Observable<number>;
  downloadURL$: Observable<string>;
  id: string;
  product: Product = {title: '', price: null, category: ''};

  constructor(private categoryService: CategoryService, private productService: ProductService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.categoryService.getCategories().snapshotChanges().pipe(
      map(categorySnapshots => {
        return categorySnapshots.map(snapshot => ({ key: snapshot.key, ...snapshot.payload.val() }))
      })
    )
    .subscribe(categories => {
      console.log(categories);
      this.categories = categories;
    })

    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id) this.productService.get(this.id).valueChanges().pipe(take(1)).subscribe(product => {
      if(product) this.product = product;
      else this.router.navigate(['/admin/products']);
    })
  }

  save(product: Product) {
    console.log('save', product);
    this.validatePrice(product.price);
    if(this.priceError) {
      return false;
    }
    if(this.file){
      const filetype = this.file.type.split('/')[1];
      const filePath = `products/${product.title}.${filetype}`;
      const {fileRef, task} = this.productService.upload(this.file, filePath);
      this.uploadPercent$ = task.percentageChanges();
      
      task.then(() => {
        fileRef.getDownloadURL().subscribe(url => {
          console.log(url);
          product.imagePath = filePath;
          product.imageUrl = url;
          this.productService.create(product);
          this.router.navigate(['/admin/products']);
        })
      });
      task.catch(err => { console.log(err) });

      // get notified when the download URL is available
      // task.snapshotChanges().pipe(
      //   finalize(() => this.downloadURL$ = fileRef.getDownloadURL())
      // )
      // .subscribe()
    }
  }

  update() {
    console.log('update', this.product);
    this.validatePrice(this.product.price);
    if(this.priceError) {
      return false;
    }
    if(this.file){
      const filetype = this.file.type.split('/')[1];
      const filePath = `products/${this.product.title}.${filetype}`;
      const {fileRef, task} = this.productService.upload(this.file, filePath);
      this.uploadPercent$ = task.percentageChanges();
      
      task.then(() => {
        fileRef.getDownloadURL().subscribe(url => {
          console.log(url);
          const prevFilePath = this.product.imagePath;
          this.product.imagePath = filePath;
          this.product.imageUrl = url;
          this.productService.update(this.id, this.product)
          .then(() => {
            if(prevFilePath !== filePath) {
              this.productService.deleteImage(prevFilePath);
            }
            this.file = null;
            this.files = [];
          })
          .catch(err => {
            console.log(err);
          });
        })
      });
      task.catch(err => { console.log(err) });
    }
    else{
      this.productService.update(this.id, this.product)
    }
  }

  delete() {
    if(confirm('Are you sure you want to delete this product?')) {
      const { imagePath } = this.product;
      this.productService.delete(this.id)
      .then(() => {
        this.productService.deleteImage(imagePath);
        this.router.navigate(['/admin/products']);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    console.log(event);
    if (event.rejectedFiles.length !== 0){
      this.imgError = 'Please upload a single image file!';
      return;
    }
    if (event.addedFiles.length === 1) {
      this.file = event.addedFiles[0];
      this.files = event.addedFiles;
      this.imgError = null;
    }
    console.log(this.file);
	}

	onRemove(event: NgxDropzoneChangeEvent) {
		console.log(event);
    this.file = null;
    this.files = [];
  }
  
  validatePrice(price: number) {
    // console.log(price);
    if (!price) {
      return this.priceError = null;
    }
    let priceStr = price.toString().split('.');
    if ( (priceStr.length === 1 || priceStr.length === 2) && !(/^[0-9]*$/.test(priceStr[0])) ) {
      this.priceError = 'Invalid price value!';
      console.log(this.priceError);
      return;
    }
    if ( priceStr.length === 2 && !(/^[0-9]{1,2}$/.test(priceStr[1])) ) {
      this.priceError = 'Price should contain two decimal places!';
      return;
    }
    if (priceStr.length === 0 || priceStr.length > 2) {
      this.priceError = 'Invalid price value!';
      return;
    }
    if (price < 0) {
      this.priceError = 'Price should not be negative!';
      return;
    }
    if (price > 1000) {
      this.priceError = 'Price should be less than $1000.00';
      return;
    }
    this.priceError = null;
  }

}

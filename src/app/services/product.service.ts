import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from '../models/product';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  create(product: Product) {
    return this.db.list<Product>('/products').push(product);
  }

  upload(file: File, filePath: string) {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return {fileRef, task};
  }

  getAll() {
    return this.db.list<Product>('/products');
  }

  get(productId: string) {
    return this.db.object<Product>('/products/' + productId);
  }

  update(productId: string, product: Product) {
    return this.db.object<Product>(`/products/${productId}`).update(product);
  }

  delete(productId: string) {
    return this.db.object<Product>(`/products/${productId}`).remove();
  }

  deleteImage(filePath: string) {
    // image path should be stored in the product document. So, change the implementation
    // save path instead of url
    return this.storage.ref(filePath).delete();
  }
}

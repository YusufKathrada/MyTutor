import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// used for testing purposes
@Injectable()
export class MockStorage {
  private storage = new BehaviorSubject<{ [key: string]: any }>({});

  get(key: string): Promise<any> {
    return Promise.resolve(this.storage.value[key]);
  }

  set(key: string, value: any): Promise<any> {
    this.storage.next({ ...this.storage.value, [key]: value });
    return Promise.resolve();
  }

  remove(key: string): Promise<any> {
    const { [key]: removed, ...rest } = this.storage.value;
    this.storage.next(rest);
    return Promise.resolve();
  }
}


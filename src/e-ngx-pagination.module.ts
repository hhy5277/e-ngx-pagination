/**
 * Created by laixiangran on 2016/9/29.
 * homepage：http://www.laixiangran.cn.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ENgxPagerComponent } from './e-ngx-pager.component';
import { ENgxPaginationComponent } from './e-ngx-pagination.component';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [ENgxPagerComponent, ENgxPaginationComponent],
    exports: [FormsModule, ENgxPagerComponent, ENgxPaginationComponent]
})
export class ENgxPaginationModule {
}

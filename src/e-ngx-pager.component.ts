import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer, Self} from '@angular/core';
import {ControlValueAccessor, NgModel} from '@angular/forms';

export interface PagerConfig {
	itemsPerPage: number;
	previousText: string;
	nextText: string;
	align: boolean;
}
export interface PageChangedEvent {
	itemsPerPage: number;
	page: number;
}

const pagerConfig: PagerConfig = {
	itemsPerPage: 10,
	previousText: '上一页',
	nextText: '下一页',
	align: true
};

@Component({
	selector: 'e-ngx-pager[ngModel]',
	templateUrl: './e-ngx-pager.component.html',
	providers: [NgModel]
})
export class ENgxPagerComponent implements ControlValueAccessor, OnInit, PagerConfig {
	public config: any;

	@Input()
	public align: boolean;

	@Input()
	public previousText: string;

	@Input()
	public nextText: string;

	@Input()
	public lastText: string;

	@Input()
	public disabled: boolean;

	@Output()
	public numPages: EventEmitter<number> = new EventEmitter<number>(false);

	@Output()
	public pageChanged: EventEmitter<PageChangedEvent> = new EventEmitter<PageChangedEvent>(false);

	@Input()
	public get itemsPerPage (): number {
		return this._itemsPerPage;
	}

	public set itemsPerPage (v: number) {
		this._itemsPerPage = v;
		this.totalPages = this.calculateTotalPages();
	}

	@Input()
	public get totalItems (): number {
		return this._totalItems;
	}

	public set totalItems (v: number) {
		this._totalItems = v;
		this.totalPages = this.calculateTotalPages();
	}

	public get totalPages (): number {
		return this._totalPages;
	}

	public set totalPages (v: number) {
		this._totalPages = v;
		this.numPages.emit(v);
		if (this.inited) {
			this.selectPage(this.page);
		}
	}

	public set page (value: number) {
		const _previous = this._page;
		this._page = (value > this.totalPages) ? this.totalPages : (value || 1);

		if (_previous === this._page || typeof _previous === 'undefined') {
			return;
		}

		this.pageChanged.emit({
			page: this._page,
			itemsPerPage: this.itemsPerPage
		});
	}

	public get page (): number {
		return this._page;
	}

	public onChange: any = Function.prototype;
	public onTouched: any = Function.prototype;

	public cd: NgModel;
	public renderer: Renderer;
	public elementRef: ElementRef;

	public classMap: string;

	private _itemsPerPage: number;
	private _totalItems: number;
	private _totalPages: number;
	private inited: boolean = false;
	private _page: number;
	public pages: Array<any>;

	public constructor (@Self() cd: NgModel, renderer: Renderer, elementRef: ElementRef) {
		this.cd = cd;
		this.renderer = renderer;
		this.elementRef = elementRef;
		cd.valueAccessor = this;
		this.config = this.config || pagerConfig;
	}

	public ngOnInit (): void {
		this.classMap = this.elementRef.nativeElement.getAttribute('class') || '';
		this.itemsPerPage = typeof this.itemsPerPage !== 'undefined'
			? this.itemsPerPage
			: pagerConfig.itemsPerPage;
		this.totalPages = this.calculateTotalPages();
		this.page = this.cd.value;
		this.inited = true;
	}

	public writeValue (value: number): void {
		this.page = value;
	}

	public getText (key: string): string {
		return pagerConfig[key + 'Text'];
	}

	public noPrevious (): boolean {
		return this.page === 1;
	}

	public noNext (): boolean {
		return this.page === this.totalPages;
	}

	public registerOnChange (fn: (_: any) => {}): void {
		this.onChange = fn;
	}

	public registerOnTouched (fn: () => {}): void {
		this.onTouched = fn;
	}

	public selectPage (page: number, event?: MouseEvent): void {
		if (event) {
			event.preventDefault();
		}

		if (!this.disabled) {
			if (event && event.target) {
				let target: any = event.target;
				target.blur();
			}
			this.writeValue(page);
			this.cd.viewToModelUpdate(this.page);
		}
	}

	private calculateTotalPages (): number {
		let totalPages = this.itemsPerPage < 1
			? 1
			: Math.ceil(this.totalItems / this.itemsPerPage);
		return Math.max(totalPages || 0, 1);
	}
}

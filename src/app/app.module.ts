import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import{ jqxChartModule } from 'jqwidgets-ng/jqxchart'

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    jqxGridModule,
    jqxChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

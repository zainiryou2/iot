import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxChartComponent } from 'jqwidgets-ng/jqxchart';
import { interval, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('myChartLum', { static: false }) myChartLum!: jqxChartComponent;
  @ViewChild('myChartDis', { static: false }) myChartDis!: jqxChartComponent;
  titleLum = 'Variation de la luminosité';
  titleDis = 'Variation de la distance';
  allumer = false;
  compteur = 0;
  distance = 0;
  luminosite = 0;
  intensite = 0;
  sourceArray: any[] = [];
  url =
    'http://localhost:8080/http://miage.mecanaute.com:22222/Thingworx/Things/MIAGE.843668/Properties';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      appKey: '5854d6d4-c908-4ffd-962f-7da5a27f817f',
    }),
  };
  xAxis: any = {
    dataField: 'id',
    gridLines: { visible: true },
    title: 'Test Id',
    unitInterval: 1
  };

  valueAxis: any = {
    visible: true,
    title: {text: 'Test'}
  };

  seriesGroupsLum: any[] =
    [
        {
            type: 'line',
            series: [
                { dataField: 'luminosite', displayText: 'Luminosité (lux)' }
            ]
        }
    ];

  seriesGroupsDis: any[] =
    [
        {
            type: 'line',
            series: [
                { dataField: 'distance', displayText: 'Distance (cm)' }
            ]
        }
    ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getProperty();
  }

  getProperty() {
    const timer = 2000; // ms
    interval(timer)
      .pipe(mergeMap(() => this.http.get(this.url, this.httpOptions)))
      .subscribe((data: any) => {
        this.compteur++;
        this.luminosite = data.rows[0].LIGHT_LUX;
        this.distance = data.rows[0].LIGHT_DIST;
        this.updateChartValues();
        this.updatePuissance();
      });
  }

  getPropertyTest() {
    const timer = 1000; // ms
    interval(timer)
      .pipe(mergeMap(() => of([Math.random() * 200, Math.random() * 10])))
      .subscribe((nombre) => {
        this.compteur++;
        this.luminosite = nombre[0];
        this.distance = nombre[1];
        this.updateChartValues();
      });
  }

  updateChartValues(){
    this.sourceArray.push({
      id: this.compteur,
      luminosite: this.luminosite,
      distance: this.distance
    });
    if (this.luminosite <= 100 && this.distance == 0) {
      this.allumer = true;
    } else {
      this.allumer = false;
    }
    this.myChartLum.update();
    this.myChartDis.update();
  }

  updatePuissance(){
    if(this.luminosite <= 100)
      this.intensite = 38;
    if(this.luminosite <= 75)
      this.intensite = 45;
    if(this.luminosite <= 50)
      this.intensite = 48;
    if(this.luminosite <= 25)
      this.intensite = 58;
  }

  checkClassEtat(){
    return this.luminosite <= 100 && this.distance === 0 ? 'allume' : 'eteint'
  }
}

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
  compteurHeure = 0;
  distance = 0;
  luminosite = 0;
  intensiteDynamique = 0;
  intensiteContinu = 0;
  intensiteDynamiquekWH;
  intensiteContinukWH;
  differencekWH = 0;
  coutDifference;
  intensite = 0;
  economie = 0;
  actualisation = 4;
  lampadaire = 38;
  sourceArray: any[] = [];
  lampadaireValeurs: any[] = [];
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
    unitInterval: this.actualisation
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
    this.getPropertyTest();
  }

  getProperty() {
    const timer = this.actualisation * 1000; // ms
    interval(timer)
      .pipe(mergeMap(() => this.http.get(this.url, this.httpOptions)))
      .subscribe((data: any) => {
        this.compteur += this.actualisation;
        this.luminosite = data.rows[0].LIGHT_LUX;
        this.distance = data.rows[0].LIGHT_DIST;
        this.updateChartValues();
        this.updatePuissance();
      });
  }

  getPropertyTest() {
    const timer = this.actualisation * 1000; // ms
    interval(timer)
      .pipe(mergeMap(() => of([Math.random() * 125, Math.random() * 2])))
      .subscribe((nombre) => {
        this.compteur += this.actualisation;
        this.luminosite = nombre[0];
        this.distance = nombre[1];
        this.updateChartValues();
        this.updatePuissance();
      });
  }

  updateChartValues(){
    if(this.sourceArray.length > 9){
      this.sourceArray.splice(0,1);
    }
    this.sourceArray.push({
      id: this.compteur,
      luminosite: this.luminosite,
      distance: this.distance
    });

    this.myChartLum.update();
    this.myChartDis.update();
  }

  updatePuissance(){
    this.compteurHeure = this.compteur / 3600;
    this.intensiteContinu += (this.lampadaire * this.actualisation);
    console.log("int cont "+this.intensiteContinu);
    console.log("lamp "+this.lampadaire);
    console.log("act "+this.actualisation);
    console.log("c heure "+this.compteurHeure);
    if (this.luminosite <= 100 && this.distance <= 2) {
      this.allumer = true;
      this.intensiteDynamique += (this.intensite * this.actualisation);
    } else {
      this.allumer = false;
    }
    this.intensiteContinukWH = ((this.intensiteContinu / 1000) / this.compteurHeure).toFixed(2);
    this.intensiteDynamiquekWH = ((this.intensiteDynamique / 1000) / this.compteurHeure).toFixed(2);
    this.differencekWH += this.intensiteContinukWH - this.intensiteDynamiquekWH;
    this.coutDifference = ((this.differencekWH * 11.06) / 100).toFixed(2);

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
    return this.luminosite <= 100 && this.distance <=2 ? 'allume' : 'eteint'
  }
}

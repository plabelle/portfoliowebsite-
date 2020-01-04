import { Component, OnInit } from '@angular/core';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Portfolio } from 'src/app/services/portfolio.model';
import { trigger, transition, style, animate, stagger, animateChild, query } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@items', stagger(60, animateChild()))
      ])
    ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.350s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class PortfolioComponent implements OnInit {

  types: string[];
  sourceNames = {TypeScript: 'Angular', HTML: 'HTML5, CSS', 'C#': 'Asp.Net' };

  private _selectedType = 'All';

  portfolios: Portfolio[];

  constructor(private portfolioSvc: PortfolioService, private route: ActivatedRoute) { }

  ngOnInit() {
    const filter = this.route.snapshot.queryParamMap.get('filter');
    if(filter) {
      this._selectedType = filter;
    }
    this.loadPortfolios(this._selectedType);
  }

  get selectedType() {
    return this._selectedType;
  }

  set selectedType(newValue: string) {
    if (newValue !== this._selectedType) {
      this._selectedType = newValue;
      this.loadPortfolios(this._selectedType);
    }
  }

  loadPortfolios(selectedType: string): void {
    this.portfolioSvc.get().subscribe(data => {
      this.types = data.map(p => p.language).filter((value, index, self) => self.indexOf(value) === index);
      this.portfolios = data.filter(p => p.language === selectedType || selectedType === 'All');
    });
  }

}

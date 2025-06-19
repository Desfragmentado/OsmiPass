import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { BoleteraComponent } from './components/boletera/boletera.component';
import { AvrilComponent } from './components/avril/avril.component';
import { PagoComponent } from './components/pago/pago.component';
import { DesfragmentadoComponent } from './components/desfragmentado/desfragmentado.component';
import { CkanComponent } from './components/ckan/ckan.component';
import { DefraComponent } from './components/defra/defra.component';
import { OsmarhaComponent } from './components/osmarha/osmarha.component';
import { PagoExitosoComponent } from './components/pago-exitoso/pago-exitoso.component';

export const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'boletera', component: BoleteraComponent },
  { path: 'avril', component: AvrilComponent },
  { path: 'ckan', component: CkanComponent },
  { path: 'defra', component: DefraComponent },
  { path: 'osmarha', component: OsmarhaComponent },
  { path: 'pago', component: PagoComponent },
  { path: 'pago-exitoso', component: PagoExitosoComponent },
  { path: 'desfragmentado', component: DesfragmentadoComponent },
  { path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import {Connexion} from './pages/connexion/connexion';
import {AjoutModif} from './pages/ajout-modif/ajout-modif';
import {Inscription} from './pages/inscription/inscription';
import {Mdp} from './pages/mdp/mdp';
import {ListeArticles} from './pages/liste-articles/liste-articles';
import {DetailArticle} from './pages/detail-article/detail-article';
import {Creation} from './pages/creation/creation';

export const routes: Routes = [
  {path: 'connexion', component: Connexion},
  {path: 'inscription', component: Inscription},
  {path: 'password', component: Mdp},
  {path: 'ajout-modif/:id', component: AjoutModif},
  {path: 'liste-articles', component: ListeArticles},
  {path: 'detail-article/:id', component: DetailArticle},
  {path: 'creation', component: Creation}
];

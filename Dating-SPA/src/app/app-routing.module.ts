import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { CardEditResolver } from './_resolver/card-edit.resolver';
import { MemberEditComponent } from './components/member/member-edit/member-edit.component';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { CardDetailsResolver } from './_resolver/card-details.resolver';
import { CardDetailsComponent } from './components/member/card-details/card-details.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MemberListComponent } from './components/member/member-list/member-list.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {path: '',component: HomeComponent},
  {path:'',runGuardsAndResolvers:'always',children:[ 
    {path: 'members',component: MemberListComponent , resolve: {
      users: MemberListResolver
    }},
    {path: 'lists',component: ListsComponent,resolve: {
      users: MemberListResolver
    }},
    {path: 'messages',component: MessagesComponent},
    {path: 'member/edit',component: MemberEditComponent , resolve: {
      user: CardEditResolver
    },canDeactivate:[PreventUnsavedChangesGuard]},
    {path: 'members/:id',component: CardDetailsComponent , resolve:{
      user: CardDetailsResolver
    }},
  ],canActivate:[AuthGuard]},
  {path: '**',redirectTo: '' , pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { UsersTableDataSource, User } from './users-table-datasource';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ApiService } from './users-table-datasource';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<User>;
  dataSource!: UsersTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['_id', 'username', 'admin', 'edit', 'delete'];

  constructor(private api: ApiService, private dialog: MatDialog) {
    api.refreshCall$.subscribe(
      () => {
        this.refeshContacts(null);
      }  
    );
  }

  refeshContacts(event: null){
    this.ngOnInit();
    this.ngAfterViewInit();
  }
  
  ngOnInit() {
    this.dataSource = new UsersTableDataSource(this.api);
    this.dataSource.loadUsers();
  }
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  deleteUserDialog(User: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '320px';
    dialogConfig.data = User;

    this.dialog.open(DeleteUserModalComponent, dialogConfig);
  }

  editUserDialog(User: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '320px';
    dialogConfig.data = User;

    this.dialog.open(EditUserModalComponent, dialogConfig);
  }

  addUserDialog() {
    const addUserDialogConfig = new MatDialogConfig();
    addUserDialogConfig.autoFocus = true;
    addUserDialogConfig.width = '320px';

    this.dialog.open(AddUserModalComponent, addUserDialogConfig);
  }
}

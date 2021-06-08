import { DataTablesModule } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from './../../admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.css']
})
export class AddMedicineComponent implements OnInit {

  constructor(private adminService: AdminService,
              private toastr: ToastrService,
              private route: Router,
              private activatedRoute: ActivatedRoute) { }

  medicineData = new FormGroup({
    medicineName: new FormControl('', [Validators.required]),
    expiryDate: new FormControl('', [Validators.required]),
    manufacturingDate: new FormControl('', [Validators.required]),
    sellingPrice: new FormControl('', [Validators.required,Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]),
    mrp: new FormControl('', [Validators.required,Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]),
    medicineCompany: new FormControl('', [Validators.required]),
    totalStip : new FormControl('', [Validators.required,Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]),
    medicineInStip : new FormControl('', [Validators.required,Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')])
  });

  medicine:any = {}
  isAddMode : boolean = true;
  medicineValues :any;
  id: string = "";
  stock: number = 0;
  medicineTitle : string = "Add Medicine";
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.getMedicine(id);
  }

  get f(){
    return this.medicineData.controls;
  }

  getMedicine(id: string){
    if(id){
      this.medicineTitle = "Edit Medicine"
      this.adminService.getMedicineById(id).subscribe((data)=>{
        this.medicine = data
        this.stock = this.medicine.data.totalStip
        this.isAddMode = false;
        this.id = id;
      },(err)=>{
        this.toastr.error(err.error.msg,"Error",{timeOut:3000});
      });
    } else {
      this.medicine.data = {
        mrp:null,
        sellingPrice:null,
        manufacturingDate:null,
        expiryDate:null,
        medicineCompany:null,
        medicineName:null,
        totalStip: null,
        medicineInStip :null
      };
    }
  }
  onSubmit(): void{
    if(!this.isAddMode){
      this.medicineValues = this.medicineData.value;
      const stock = this.stock + parseInt(this.medicineData.value.totalStip);
      this.medicineValues._id = this.id;
      this.medicineValues.totalStip = stock;
      this.adminService.updateMedicine(this.medicineValues).subscribe((data)=>{
        this.toastr.success('Medicine Update Successfully','Success',{timeOut:2000});
        this.medicineData.reset();
      }, (err)=>{
        this.toastr.error(err.error.msg,'Error',{timeOut:3000});
        this.medicineData.reset();
      });
    } else {
      this.adminService.addMedicine(this.medicineData.value).subscribe((data)=>{
        this.toastr.success('Medicine added Successfully','Success',{timeOut:2000});
        this.medicineData.reset();
      }, (err)=>{
        this.toastr.error(err.error.msg,'Error',{timeOut:3000});
        this.medicineData.reset();
      });
    }
  }

}

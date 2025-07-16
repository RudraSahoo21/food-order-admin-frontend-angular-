import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormsModule,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormValidationService } from '../../form-validation.service';

@Component({
  selector: 'app-scheduled-order-configuration',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './scheduled-order-configuration.component.html',
  styleUrl: './scheduled-order-configuration.component.css',
})
export class ScheduledOrderConfigurationComponent implements OnInit {
  slotBooking!: FormGroup;
  isChecked: boolean = false;

  constructor(private formService: FormValidationService) {}

  ngOnInit(): void {
    this.min_duration_list;
    this.max_duration_list;
    this.slotBooking = new FormGroup({
      allow_scheduling: new FormControl(false),
      maxi_duration: new FormControl('', [Validators.required]),
      mini_duration: new FormControl('', [Validators.required]),
      hour_gap: new FormControl('', [Validators.required]),
    });

    this.formService.registerForm(this.slotBooking);

    this.slotBooking.get('hour_gap')?.valueChanges.subscribe((value) => {
      if (value) {
        this.generateSlots(); // Auto-trigger when data is patched
      }
    });
  }

  checkboxClicked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('the value of isChecked', isChecked);
    this.slotBooking.get('allow_scheduling')?.setValue(isChecked);
    console.log(
      'the value of allow_scheduling',
      this.slotBooking.get('allow_scheduling')?.value
    );
  }

  fromvaluescheck() {
    console.log(this.slotBooking.value);
  }

  // ......................................................................Dynamically Added options of a dropdown
  // Minimun Durations
  min_duration_list: { text: string }[] = [
    {
      text: '1 Hours',
    },
    {
      text: '2 Hours',
    },
    {
      text: '3 Hours',
    },
    {
      text: '4 Hours',
    },
    {
      text: '5 Hours',
    },
    {
      text: '6 Hours',
    },
    {
      text: '7 Hours',
    },
    {
      text: '8 Hours',
    },
    {
      text: '9 Hours',
    },
    {
      text: '10 Hours',
    },
    {
      text: '11 Hours',
    },
    {
      text: '12 Hours',
    },
    {
      text: '13 Hours',
    },
    {
      text: '14 Hours',
    },
    {
      text: '15 Hours',
    },
    {
      text: '16 Hours',
    },
    {
      text: '17 Hours',
    },
    {
      text: '18 Hours',
    },
    {
      text: '19 Hours',
    },
    {
      text: '20 Hours',
    },
    {
      text: '21 Hours',
    },
    {
      text: '22 Hours',
    },
    {
      text: '23 Hours',
    },
    {
      text: '24 Hours',
    },
    {
      text: '25 Hours',
    },
    {
      text: '26 Hours',
    },
    {
      text: '27 Hours',
    },
    {
      text: '28 Hours',
    },
    {
      text: '29 Hours',
    },
    {
      text: '30 Hours',
    },
    {
      text: '31 Hours',
    },
    {
      text: '32 Hours',
    },
    {
      text: '33 Hours',
    },
    {
      text: '34 Hours',
    },
    {
      text: '35 Hours',
    },
    {
      text: '36 Hours',
    },
    {
      text: '37 Hours',
    },
    {
      text: '38 Hours',
    },
    {
      text: '39 Hours',
    },
    {
      text: '40 Hours',
    },
    {
      text: '41 Hours',
    },
    {
      text: '42 Hours',
    },
    {
      text: '43 Hours',
    },
    {
      text: '44 Hours',
    },
    {
      text: '45 Hours',
    },
    {
      text: '46 Hours',
    },
    {
      text: '47 Hours',
    },
    {
      text: '48 Hours',
    },
  ];

  // maximum duration
  max_duration_list: { hour: number; text: string }[] = [
    {
      hour: 12,
      text: 'Hours',
    },
    {
      hour: 24,
      text: 'Hours',
    },
    {
      hour: 36,
      text: 'Hours',
    },
    {
      hour: 48,
      text: 'Hours',
    },
    {
      hour: 60,
      text: 'Hours',
    },
    {
      hour: 72,
      text: 'Hours',
    },
    {
      hour: 84,
      text: 'Hours',
    },
    {
      hour: 96,
      text: 'Hours',
    },
    {
      hour: 108,
      text: 'Hours',
    },
    {
      hour: 120,
      text: 'Hours',
    },
  ];

  slot_hour_list: { hour: number; text: string }[] = [
    {
      hour: 0.5,
      text: 'Hours',
    },
    {
      hour: 1,
      text: 'Hours',
    },
    {
      hour: 2,
      text: 'Hours',
    },
    {
      hour: 3,
      text: 'Hours',
    },
    {
      hour: 4,
      text: 'Hours',
    },
    {
      hour: 5,
      text: 'Hours',
    },
    {
      hour: 6,
      text: 'Hours',
    },
    {
      hour: 7,
      text: 'Hours',
    },
    {
      hour: 8,
      text: 'Hours',
    },
    {
      hour: 9,
      text: 'Hours',
    },
    {
      hour: 10,
      text: 'Hours',
    },
    {
      hour: 11,
      text: 'Hours',
    },
    {
      hour: 12,
      text: 'Hours',
    },
  ];

  // ..................................................................................................Slot Schedule
  startTime: number = 8;
  endTime: number = 20;
  slots: string[] = [];
  selectedDuration: number = 0;
  //genetateing slots
  generateSlots() {
    this.selectedDuration = parseFloat(this.slotBooking.get('hour_gap')?.value);
    // console.log('Duration  ', this.selectedDuration);
    this.slots = [];
    this.checkedSlots = [];
    for (let i = this.startTime; i < this.endTime; i += this.selectedDuration) {
      if (i + this.selectedDuration <= this.endTime) {
        const start = this.formatTime(i);
        // console.log('Starting Time  ', start);
        const end = this.formatTime(i + this.selectedDuration);
        //  console.log('Ending Time  ', end);
        this.slots.push(`${start} - ${end}`);
      }
    }
    // console.log(this.slots);
  }
  // format time
  formatTime(hour: number): string {
    const period = hour < 12 ? 'AM' : 'PM';
    let formattedHour = hour % 12;
    formattedHour = Math.trunc(formattedHour === 0 ? 12 : formattedHour);
    //console.log('formated hour  ', formattedHour);
    const minute = hour % 1 === 0 ? '00' : '30'; // If hour is a whole number, show minutes as '00'. Otherwise, show '30' for half hour.
    return `${formattedHour}:${minute} ${period}`;
  }

  // .....................................................................when click the slot color will change logic\

  checkedSlots: string[] = []; //
  selectSlot(index: number) {
    if (this.checkedSlots[index] != 'bg-light') {
      this.checkedSlots[index] = 'bg-light';
    } else {
      this.checkedSlots[index] = '';
    }
    console.log(this.checkedSlots);
  }
}

'use strict';

// DOM references
let availabilityInput = document.getElementById('availability');
let floorsInput = document.getElementById('floors');
let areasInput = document.getElementById('areas');
let findRoomButton = document.getElementById('find-room');
let roomTable = document.getElementById('room-table');

// Create some enums for selection parsing
const AVAILABILITY = Object.freeze({
    GENERAL_TODAY: 'general-today',
    NEXT_1_HOUR: 'next-1-hour',
    NEXT_2_HOURS: 'next-2-hours',
    NEXT_3_HOURS: 'next-3-hours',
    NEXT_4_HOURS: 'next-4-hours',
    NEXT_5_HOURS: 'next-5-hours',
    NEXT_6_HOURS: 'next-6-hours',
});
const FLOORS = Object.freeze({
    ALL_FLOORS: 'all-floors',
    FLOOR_1_ONLY: 'floor-1-only',
    FLOOR_2_ONLY: 'floor-2-only',
    FLOOR_3_ONLY: 'floor-3-only',
    FLOOR_4_ONLY: 'floor-4-only',
    FLOOR_5_ONLY: 'floor-5-only',
});
const AREAS = Object.freeze({
    ALL_AREAS: 'all-areas',
    AREA_A_ONLY: 'area-a-only',
    AREA_C_ONLY: 'area-c-only',
});

// Room lookup and other constants
const CORSPROXY_PREFIX = 'https://corsproxy.nl/';
const ROOMS = {
    A102: {
        name: 'A1.02',
        floor: 1,
        area: 'A',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFftcS7O6ERztCOw9WmvTIdZkPbJBTDRwb5aRmg-K-lwWITqdrjNo02yPvZayv8lfpynEGndqrfGuvTr2r4ndO2w&salt=-1916867539',
    },
    A103: {
        name: 'A1.03',
        floor: 1,
        area: 'A',
        number: 3,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFftcS7O6ERztCOw9WmvTIdXCs0j8rTL3qRrRR9PxSnFVwaEyi5k2CFQvG6wlfvxVsbKf8V35YVn7HreM395uTKg&salt=-1916867539',
    },
    A104: {
        name: 'A1.04',
        floor: 1,
        area: 'A',
        number: 4,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFftcS7O6ERztCOw9WmvTIdbACVJ1_daAtTKdAXkVhpkTyk5QIRTEznhs77ARqlz50ynEGndqrfGuvTr2r4ndO2w&salt=-1916867539',
    },
    A105: {
        name: 'A1.05',
        floor: 1,
        area: 'A',
        number: 5,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFftcS7O6ERztCOw9WmvTIdVcboayIVvJN2SZWViCk3qeZ2DxYsQw2BR-3flSeJfJmSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539',
    },
    A106: {
        name: 'A1.06',
        floor: 1,
        area: 'A',
        number: 6,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFftcS7O6ERztCOw9WmvTIdb9i___UbPnyiVu8ZWrLNqt0I4_Aix_Zh1y7Dpgag_pFSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539',
    },
    A107: {
        name: 'A1.07',
        floor: 1,
        area: 'A',
        number: 7,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFftcS7O6ERztCOw9WmvTIdVqPUwVi32QG72piXtVMDHzorp6CBZCb1FwkuOgwNxgIIUQ1RhEYxI8ckde9URa_ng&salt=-1916867539',
    },
    A108: {
        name: 'A1.08',
        floor: 1,
        area: 'A',
        number: 8,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFftcS7O6ERztCOw9WmvTIdYUgaQmuHwS8e3QHcsC7paOh120ZHPap5lCxSHD7I35eSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539',
    },
    A202: {
        name: 'A2.02',
        floor: 2,
        area: 'A',
        number: 2,
        url: 'rapla.dhbw.de/rapla/internal_calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=r7fa19e6-1dee-4faa-bf5f-5fb532ae74a1',
    },
    A204: {
        name: 'A2.04',
        floor: 2,
        area: 'A',
        number: 4,
        url: 'rapla.dhbw.de/rapla/internal_calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=r6d5fbea-dbb2-4798-8186-6b5b8f066811',
    },
    A205: {
        name: 'A2.05',
        floor: 2,
        area: 'A',
        number: 5,
        url: 'rapla.dhbw.de/rapla/internal_calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=r35270cf-f604-4351-a434-ad1cf366a954',
    },
    A206: {
        name: 'A2.06',
        floor: 2,
        area: 'A',
        number: 6,
        url: 'rapla.dhbw.de/rapla/internal_calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=rb978700-6b6e-44c1-a0f3-f24e92eb37ff',
    },
    A207: {
        name: 'A2.07',
        floor: 2,
        area: 'A',
        number: 7,
        url: 'rapla.dhbw.de/rapla/internal_calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=re304931-3337-480d-91d3-cd80e6a7111a',
    },
    A208: {
        name: 'A2.08',
        floor: 2,
        area: 'A',
        number: 8,
        url: 'rapla.dhbw.de/rapla/internal_calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=r7c34829-557e-4a4f-b8af-a0cadf3bae00',
    },
    A209: {
        name: 'A2.09',
        floor: 2,
        area: 'A',
        number: 9,
        url: 'rapla.dhbw.de/rapla/internal_calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=rb97e489-11a5-47ee-8f8b-160ad5bae84e',
    },
    A210: {
        name: 'A2.10',
        floor: 2,
        area: 'A',
        number: 10,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFZxKWX51qjT-tzPHJoU1zuHoqi09yvFcLNC2QVuk6A5Ffc-0Pwi8mfDgNxuqra3lGSh4zF_0DH3pK3PHY9EruAw&salt=-1916867539&allocatable_id=r0a58970-7419-48ea-9507-ef376861ecf3',
    },
    A302: {
        name: 'A3.02',
        floor: 3,
        area: 'A',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFFH2vSm0pKRbmeavhbIe-HOi6CkEDtnhMzvZU-6CVJDUpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r3dd5ab8-5e14-4300-bfee-e8e1451791ba',
    },
    A303: {
        name: 'A3.03',
        floor: 3,
        area: 'A',
        number: 3,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFFH2vSm0pKRbmeavhbIe-HOi6CkEDtnhMzvZU-6CVJDUpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=re87a294-1403-4f7d-af64-66e98e4cea75',
    },
    A304: {
        name: 'A3.04',
        floor: 3,
        area: 'A',
        number: 4,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFFH2vSm0pKRbmeavhbIe-HOi6CkEDtnhMzvZU-6CVJDUpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r56cbd5a-db42-442c-9376-d075a398d613',
    },
    A305: {
        name: 'A3.05',
        floor: 3,
        area: 'A',
        number: 5,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFFH2vSm0pKRbmeavhbIe-HOi6CkEDtnhMzvZU-6CVJDUpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=rff5ae4d-3f2e-4657-9a27-54cdfb704c97',
    },
    A402: {
        name: 'A4.02',
        floor: 4,
        area: 'A',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r9ebcd06-dad7-424c-ab53-3ca541ab3121',
    },
    A403: {
        name: 'A4.03',
        floor: 4,
        area: 'A',
        number: 3,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=reb8d1a7-7ec7-4dfa-95a6-2e8738e9951b',
    },
    A404: {
        name: 'A4.04',
        floor: 4,
        area: 'A',
        number: 4,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=rd06507e-4b61-4009-b80c-ea657e364e6e',
    },
    A406: {
        name: 'A4.06',
        floor: 4,
        area: 'A',
        number: 6,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r0bb52c3-80b6-4d2d-9721-7d392ee29eb8',
    },
    A407: {
        name: 'A4.07',
        floor: 4,
        area: 'A',
        number: 7,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=rb724adc-792a-414d-bb02-1e8bb3469cfb',
    },
    A408: {
        name: 'A4.08',
        floor: 4,
        area: 'A',
        number: 8,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r7f55106-8350-4995-8ee7-ce2b2d06f748',
    },
    A409: {
        name: 'A4.09',
        floor: 4,
        area: 'A',
        number: 9,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=ra4f0c7c-41b4-4208-bce6-ec3be98945b7',
    },
    A410: {
        name: 'A4.10',
        floor: 4,
        area: 'A',
        number: 10,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFTdoY6ys2ObDBg5zLX7opro3pHsBnH1la3ideA3zOp2kpO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r862c821-8ef4-451c-a6b1-6bf7d13bb3ce',
    },
    A502: {
        name: 'A5.02',
        floor: 5,
        area: 'A',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r660792a-99f2-40a9-842b-d65003a1999f',
    },
    A503: {
        name: 'A5.03',
        floor: 5,
        area: 'A',
        number: 3,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r2ec78ca-b7eb-4321-8ebd-4c97a0c56aa4',
    },
    A504: {
        name: 'A5.04',
        floor: 5,
        area: 'A',
        number: 4,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=rf939530-f0fd-4914-8c21-def6dfef80a4',
    },
    A505: {
        name: 'A5.05',
        floor: 5,
        area: 'A',
        number: 5,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=rc77c336-f59e-41d1-9610-16649063f051',
    },
    A506: {
        name: 'A5.06',
        floor: 5,
        area: 'A',
        number: 6,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r5247f8e-b4f0-4da9-925d-62055fcfdfc1',
    },
    A507: {
        name: 'A5.07',
        floor: 5,
        area: 'A',
        number: 7,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=r1ad63cf-3d5d-43c9-918b-588a3f4b6f3a',
    },
    A508: {
        name: 'A5.08',
        floor: 5,
        area: 'A',
        number: 8,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=re8f0ae7-b46d-405b-8f45-2f34f93d49a0',
    },
    A509: {
        name: 'A5.09',
        floor: 5,
        area: 'A',
        number: 9,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFKSA9ilXVbTyjq91ZKj4iL1B_TyrCaRfNtWi4Wo018y8pO0ijFnwnv9WjRXXzpkGJynEGndqrfGuvTr2r4ndO2w&salt=-1916867539&allocatable_id=rede9f91-b99a-485b-8554-0963d9f075cf',
    },
    C101: {
        name: 'C1.01',
        floor: 1,
        area: 'C',
        number: 1,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r8d3130d-ebd2-4987-9c40-89c7785a968b',
    },
    C102: {
        name: 'C1.02',
        floor: 1,
        area: 'C',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r3f8309a-fdac-4393-87fc-1ab4e3a32220',
    },
    C205: {
        name: 'C2.05',
        floor: 2,
        area: 'C',
        number: 5,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r3d9c401-d530-439f-8b6d-031eee41ce9f',
    },
    C301: {
        name: 'C3.01',
        floor: 3,
        area: 'C',
        number: 1,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r3406c73-9d65-4489-87f5-189758726bbf',
    },
    C302: {
        name: 'C3.02',
        floor: 3,
        area: 'C',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=re7d4b7f-170d-4f99-a987-5d0eda0ae1c0',
    },
    C303: {
        name: 'C3.03',
        floor: 3,
        area: 'C',
        number: 3,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r14fbe6a-ff50-44ef-8596-396240ffbcda',
    },
    C304: {
        name: 'C3.04',
        floor: 3,
        area: 'C',
        number: 4,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=rd962c27-e08a-43e9-bb73-c0c43b1d9b95',
    },
    C305: {
        name: 'C3.05',
        floor: 3,
        area: 'C',
        number: 5,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r297f463-dc49-4202-99d9-f95d0ad78428',
    },
    C401: {
        name: 'C4.01',
        floor: 4,
        area: 'C',
        number: 1,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r0b0e10a-9bff-4d24-a1e0-5d5a38d6414d',
    },
    C402: {
        name: 'C4.02',
        floor: 4,
        area: 'C',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r653ee64-cd6b-4b41-ba79-57bc3375e6e8',
    },
    C403: {
        name: 'C4.03',
        floor: 4,
        area: 'C',
        number: 3,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r248cdb4-6506-4dc5-ab8c-ec271ab51c77',
    },
    C404: {
        name: 'C4.04',
        floor: 4,
        area: 'C',
        number: 4,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=rab4136a-203f-4135-a445-9712b82b1792',
    },
    C405: {
        name: 'C4.05',
        floor: 4,
        area: 'C',
        number: 5,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=rc7c4d39-ccc2-44f7-aa47-d9a8133118b2',
    },
    C501: {
        name: 'C5.01',
        floor: 5,
        area: 'C',
        number: 1,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r62a56a7-482d-44f5-b1fa-1f30526a4935',
    },
    C502: {
        name: 'C5.02',
        floor: 5,
        area: 'C',
        number: 2,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=re85d8f1-c589-45b9-899e-8e37112aa1c6',
    },
    C503: {
        name: 'C5.03',
        floor: 5,
        area: 'C',
        number: 3,
        url: 'rapla.dhbw.de/rapla/calendar?key=9TlvoFG0Qam4ia65PD6_Iy3lqAFNTXJWKXIkOFH_Wpc7OGetMCesGkE9r3m6WlIFqYO_7OkRsvGkGyRGDyz3_hXywblAnh3DM6CFYHxm8TARd1RDkR4S6PTUzPKR67_xOf6iz2Lu4wf7tXEbVnYfihZUgc9ZiFSEQ3hv-lbPkrQ&salt=-1916867539&allocatable_id=r6fa6a55-2300-4661-b11a-dbf56135b693',
    },
};
const DATE_FORMATTER = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
});
const MINUTES_PER_BLOCK = 15;
const MINUTES_PER_DAY = 24 * 60;
const FETCH_BATCH_SIZE = 6;
const ROOM_TABLE_HEADER = `
<tr>
    <th colspan="8">Room:</th>
    <th colspan="4">00</th>
    <th colspan="4">01</th>
    <th colspan="4">02</th>
    <th colspan="4">03</th>
    <th colspan="4">04</th>
    <th colspan="4">05</th>
    <th colspan="4">06</th>
    <th colspan="4">07</th>
    <th colspan="4">08</th>
    <th colspan="4">09</th>
    <th colspan="4">10</th>
    <th colspan="4">11</th>
    <th colspan="4">12</th>
    <th colspan="4">13</th>
    <th colspan="4">14</th>
    <th colspan="4">15</th>
    <th colspan="4">16</th>
    <th colspan="4">17</th>
    <th colspan="4">18</th>
    <th colspan="4">19</th>
    <th colspan="4">20</th>
    <th colspan="4">21</th>
    <th colspan="4">22</th>
    <th colspan="4">23</th>
</tr>
`;

// Some global variables
// Each room contains its metadata and blockedTimes, measured in minutes after midnight.
let rooms = {};
let roomsDate = '';

// Use Stuttgart's date and time even when the visitor is in a different time zone.
function getCurrentTime() {
    const parts = Object.fromEntries(DATE_FORMATTER.formatToParts(new Date()).map((part) => [part.type, part.value]));
    return {
        date: `${parts.year}-${parts.month}-${parts.day}`,
        dateString: `${parts.day}.${parts.month}.`,
        minutes: Number(parts.hour) * 60 + Number(parts.minute) + Number(parts.second) / 60,
    };
}

// Extract only the bookings in today's column of a Rapla weekly calendar.
function parseBlockedTimes(html, dateString) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const table = doc.querySelector('.week_table');
    if (!table) {
        throw new Error('The Rapla page does not contain a weekly calendar');
    }

    const weekdays = [...table.querySelectorAll('.week_header')];
    const dayIndex = weekdays.findIndex((weekday) => weekday.textContent.match(/\b\d{2}\.\d{2}\./)?.[0] === dateString);
    if (dayIndex === -1) {
        throw new Error(`The Rapla calendar does not contain ${dateString}`);
    }

    const blockedTimes = [];
    for (const row of table.rows) {
        let currentDay = 0;
        for (const cell of row.cells) {
            // Full separators end a day; small separators can also split overlapping bookings within a day.
            if (cell.classList.contains('week_separatorcell') || cell.classList.contains('week_separatorcell_black')) {
                currentDay++;
                continue;
            }
            if (currentDay !== dayIndex || !cell.classList.contains('week_block')) {
                continue;
            }

            const bookings = [...cell.querySelectorAll(':scope > a')];
            if (bookings.length === 0) {
                throw new Error('A Rapla booking has no readable time range');
            }
            for (const booking of bookings) {
                const time = booking.textContent.match(/^\s*(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
                if (!time) {
                    throw new Error('A Rapla booking has no readable time range');
                }
                const begin = Number(time[1]) * 60 + Number(time[2]);
                const end = Number(time[3]) * 60 + Number(time[4]);
                if (Number(time[2]) >= 60 || Number(time[4]) >= 60 || begin >= end || end > MINUTES_PER_DAY) {
                    throw new Error('A Rapla booking has an invalid time range');
                }
                blockedTimes.push({ begin, end });
            }
        }
    }
    return blockedTimes.sort((a, b) => a.begin - b.begin || a.end - b.end);
}

// Fetch in small batches so the proxy does not have to serve every room at once.
async function fetchRooms() {
    const today = getCurrentTime();
    const roomEntries = Object.entries(ROOMS);
    const fetchedRooms = {};
    const failedRooms = [];

    for (let offset = 0; offset < roomEntries.length; offset += FETCH_BATCH_SIZE) {
        await Promise.all(
            roomEntries.slice(offset, offset + FETCH_BATCH_SIZE).map(async ([id, room]) => {
                try {
                    // Public calendars also work for the rooms whose lookup uses internal_calendar.
                    const url = CORSPROXY_PREFIX + room.url.replace('/internal_calendar?', '/calendar?');
                    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
                    if (!response.ok) {
                        throw new Error(`Rapla returned HTTP ${response.status}`);
                    }
                    const blockedTimes = parseBlockedTimes(await response.text(), today.dateString);
                    fetchedRooms[id] = { ...room, blockedTimes };
                } catch (error) {
                    failedRooms.push(room.name);
                    console.error(`Could not load ${room.name}`, error);
                }
            }),
        );
    }

    // Replace old results, including rooms whose latest request failed.
    rooms = fetchedRooms;
    roomsDate = today.date;
    if (getCurrentTime().date !== roomsDate) {
        rooms = {};
        throw new Error('The date changed while loading the rooms. Please try again');
    }
    if (failedRooms.length > 0) {
        throw new Error(
            `Could not load availability for: ${failedRooms.join(', ')}. These rooms are omitted. Please try again`,
        );
    }
    return rooms;
}

// General today shows every loaded room; the hourly options require uninterrupted availability from now.
function filterRooms() {
    const availability = availabilityInput.value;
    const floor = floorsInput.value;
    const area = areasInput.value;
    if (
        !Object.values(AVAILABILITY).includes(availability) ||
        !Object.values(FLOORS).includes(floor) ||
        !Object.values(AREAS).includes(area)
    ) {
        throw new Error('Select a valid availability, floor, and area');
    }

    const now = getCurrentTime();
    const hours = availability === AVAILABILITY.GENERAL_TODAY ? 0 : Number(availability.split('-')[1]);
    const end = now.minutes + hours * 60;
    // Today's calendar cannot establish availability beyond midnight.
    if (roomsDate !== now.date || (hours > 0 && end > MINUTES_PER_DAY)) {
        return [];
    }

    const selectedFloor = floor === FLOORS.ALL_FLOORS ? null : Number(floor.split('-')[1]);
    const selectedArea = area === AREAS.ALL_AREAS ? null : area.split('-')[1].toUpperCase();
    return Object.values(rooms).filter((room) => {
        if (selectedFloor !== null && room.floor !== selectedFloor) {
            return false;
        }
        if (selectedArea !== null && room.area !== selectedArea) {
            return false;
        }
        return hours === 0 || !room.blockedTimes.some((time) => time.begin < end && time.end > now.minutes);
    });
}

// Format minutes after midnight as a zero-padded HH:MM time.
function formatTime(minutes) {
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

// Show a loading or error message spanning the table beneath its time header.
function showTableMessage(message) {
    roomTable.innerHTML = ROOM_TABLE_HEADER;
    const row = roomTable.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 104;
    cell.textContent = message;
}

// Render rooms ordered by floor, area, and number with colored 15-minute availability cells.
function visualizeRooms(filteredRooms = filterRooms()) {
    roomTable.innerHTML = ROOM_TABLE_HEADER;
    // Fail fast with empty data
    if (filteredRooms.length === 0) {
        showTableMessage('None');
        return;
    }

    const sortedRooms = [...filteredRooms].sort(
        (a, b) => a.floor - b.floor || a.area.localeCompare(b.area) || a.number - b.number,
    );
    for (const room of sortedRooms) {
        const row = roomTable.insertRow();
        const nameCell = row.insertCell();
        nameCell.colSpan = 8;
        nameCell.textContent = room.name;

        for (let begin = 0; begin < MINUTES_PER_DAY; begin += MINUTES_PER_BLOCK) {
            const end = begin + MINUTES_PER_BLOCK;
            // Any overlap blocks the whole 15-minute cell, including non-quarter-hour bookings.
            const blocked = room.blockedTimes.some((time) => time.begin < end && time.end > begin);
            const cell = row.insertCell();
            cell.style.padding = '0';
            cell.style.backgroundColor = blocked ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)';
            cell.title = `${room.name}: ${formatTime(begin)} - ${formatTime(end)} (${blocked ? 'Blocked' : 'Available'})`;
            cell.setAttribute('aria-label', cell.title);
        }
    }
}

// Load fresh bookings before applying the current selections.
async function updateRooms() {
    if (findRoomButton.disabled) {
        return;
    }
    findRoomButton.disabled = true;
    findRoomButton.textContent = 'Loading rooms...';
    showTableMessage('Loading room availability...');
    try {
        await fetchRooms();
        visualizeRooms(filterRooms());
    } catch (error) {
        if (Object.keys(rooms).length > 0 && roomsDate === getCurrentTime().date) {
            visualizeRooms(filterRooms());
        } else {
            showTableMessage('Room availability could not be loaded. Please try again');
        }
        alert(error);
        console.error(error);
    } finally {
        findRoomButton.disabled = false;
        findRoomButton.textContent = 'Find room';
    }
}

// Handle initialization on load and subsequent room searches.
window.addEventListener('load', updateRooms);
findRoomButton.addEventListener('click', updateRooms);

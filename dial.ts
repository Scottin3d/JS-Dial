import { Vector2 } from "./vector2";
import { IDayInfo } from "./dial-models";





function fetchDayInfo(lat: number, lng: number): void {

} 

export class Dial{
    public canvas = document.getElementById('canvas') as HTMLCanvasElement;
    public apiResponse = document.getElementById('apiResponse') as HTMLDivElement;
    public ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    public center: Vector2 = new Vector2(this.canvas.width / 2, this.canvas.height / 2);
    public clockRadius: number = 300;
    public sunRadius: number = 25;

    public dayInfo: IDayInfo = {} as IDayInfo;

    constructor(){
        document.getElementById('getSunriseSunsetBtn').addEventListener('click', handleButtonClick);
    }

    public fetchDayInfo(lat: number, lng: number): void {
        const apiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;

        fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Display the API response
            console.log('Success:', data);

            let result: IDayInfo = {
                sunrise: this._offSetTimeZone(new Date(data.results.sunrise)),
                sunset: this._offSetTimeZone(new Date(data.results.sunset)),
                solarNoon: this._offSetTimeZone(new Date(data.results.solar_noon)),
                dayLength: data.results.day_length,
                civilTwilightBegin: this._offSetTimeZone(new Date(data.results.civil_twilight_begin)),
                civilTwilightEnd: this._offSetTimeZone(new Date(data.results.civil_twilight_end)),
                nauticalTwilightBegin: this._offSetTimeZone(new Date(data.results.nautical_twilight_begin)),
                nauticalTwilightEnd: this._offSetTimeZone(new Date(data.results.nautical_twilight_end)),
                astronomicalTwilightBegin: this._offSetTimeZone(new Date(data.results.astronomical_twilight_begin)),
                astronomicalTwilightEnd: this._offSetTimeZone(new Date(data.results.astronomical_twilight_end))
            }

            this.dayInfo = result;
            this.apiResponse.textContent = JSON.stringify(data, null, 2);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    private _offSetTimeZone(date: Date): Date{
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date;
    }
}
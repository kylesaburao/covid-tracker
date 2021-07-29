
export default class Statistics {
    constructor(dailyValues) {
      const CHANGE_WINDOWS = [1, 7, 14];
      const CHANGE_KEYS =
        dailyValues.length > 0
          ? Object.keys(dailyValues[0]).filter((key) => this._isChange(key))
          : [];
  
      this.data = dailyValues;
      this.days = this.data.length;
      this.available = this.days > 0;
  
      this.statistics = {
        totals: this._extractTotals(this.data),
        changes: {},
      };
  
      // Calculate the window average for each change key
      CHANGE_KEYS.forEach((key) => {
        CHANGE_WINDOWS.forEach((window) => {
          let actualWindow = 0;
          let min = undefined;
          let max = 0;
          let average = 0;
  
          for (
            let i = 0;
            i < window && 0 <= this.days - i - 1 && this.days - i - 1 < this.days;
            ++i
          ) {
            const value = this.data[this.days - i - 1][key];
  
            if (min === undefined || value < min) {
              min = value;
            }
  
            if (value > max) {
              max = value;
            }
  
            average += value;
            actualWindow++;
          }
  
          if (actualWindow > 0) {
            average /= actualWindow;
          }
  
          this.statistics.changes[key] = {
            ...this.statistics.changes[key],
            [actualWindow]: { min, max, average },
          };
        });
      });
    }
  
    _extractTotals(data) {
      let totals = {};
  
      if (data.length > 0) {
        Object.entries(data[data.length - 1]).forEach(([key, value]) => {
          if (this._isTotal(key)) {
            totals[key] = value;
          }
        });
      }
  
      return totals;
    }
  
    getTotal(key) {
      try {
        return this.statistics.totals[key];
      } catch (e) {
        return 0;
      }
    }
  
    getChange(key, window) {
      try {
        return this.statistics.changes[key][window];
      } catch (e) {
        return { min: 0, max: 0, average: 0 };
      }
    }
  
    _isTotal(key) {
      return key.startsWith("total_");
    }
  
    _isChange(key) {
      return key.startsWith("change_");
    }
  }
  
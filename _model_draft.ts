// types.ts

// User and Preferences

export interface User {
    userId: number;
    name: string;
    email: string;
    passwordHash: string;
    preferences: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserPreferences {
    userId: number;
    units: 'metric' | 'imperial';
    // Heart rate zones and thresholds are associated via userId
  }
  
  // Heart Rate Zone
  export interface HeartRateZone {
    zoneId: number;
    userId: number;
    name: string; // e.g., "Zone 1"
    lowerBound: number; // in bpm
    upperBound: number; // in bpm
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Thresholds
  export interface Threshold {
    thresholdId: number;
    userId: number;
    lactateThreshold: number; // in bpm
    aerobicExhaustionThreshold: number; // in bpm
    effectiveDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  // Macro Plan  
  export interface MacroPlan {
    planId: number;
    userId: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    units: PlanUnit[]; // Weekly plans
    events: PlanEvent[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Event
  
  export interface PlanEvent {
    eventId: number;
    planId: number;
    title: string;
    date: Date;
    description: string;
  }
  
  // Plan Unit (Weekly Plan)
  
  export interface PlanUnit {
    unitId: number;
    planId: number;
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    plannedActivities: PlannedActivity[];
    notes: string;
  }
  
  // Planned Activity
  
  export interface PlannedActivity {
    plannedActivityId: number;
    unitId: number; //plan unit id
    date: Date;
    activityType: string;
    plannedMetadata: PlannedActivityMetadata;
    notes: string;
  }
  

  //TODO: add unit for distance/vertical
  
  export interface PlannedActivityMetadata {
    distance: number; // in kilometers
    verticalGain: number; // in meters
    duration: number; // in minutes
  }
  
  // Activity
  
  export interface Activity {
    activityId: number;
    userId: number;
    plannedActivityId?: number; // Optional reference to a planned activity
    startTime: Date;
    endTime: Date;
    activityType: string;
    gpsData: GPSDataPoint[];
    accelerationData: AccelerometerDataPoint[]; // Accelerometer data
    gyroData: GyroscopeDataPoint[]; // Gyroscope data
    routeData: RouteDataPoint[]; // normalized route data based on GPS, Gyro and Acceleration data
    heartRateData: HeartRateDataPoint[];
    zonesSummary: ActivityZoneData[];
    metadata: ActivityMetadata;
    perceivedGrade: 'A' | 'B' | 'C' | 'D' | 'E'; // User's assessment (A is best, E is worst)
    userNotes: string;
    zonesUsed: HeartRateZone[]; // Zones used for this activity
    thresholds: Threshold[]; // Thresholds at the time of the activity
    createdAt: Date;
    updatedAt: Date;
    startEndPoints: StartEndPoints;
  }

  export interface StartEndPoints {
    start: TimePoint;
    end: TimePoint;
  }

  // Activity 
  
  // Activity Metadata
  
  export interface ActivityMetadata {
    distance: number; // in kilometers or miles
    verticalGain: number; // in meters or feet
    duration: number; // in minutes or hours
    source: string; // e.g., 'manual', 'device_a', 'average'
    manualOverride: boolean;
  }

  export interface Point {
    latitude: number;
    longitude: number;
  }

  export interface TimePoint extends Point {
    timestamp: Date;
  }
  
  // GPS Data Point
  
  export interface GPSDataPoint {
    point: TimePoint;
    altitude: number;
    accuracy: "high" | "medium" | "low";
  }

  // Gyroscope Data Point
  export interface GyroscopeDataPoint {
    x: number;
    y: number;
    z: number;
    timestamp: Date;
    _tag: "GyroscopeDataPoint";
  }

  // Accelerometer Data Point
  export interface AccelerometerDataPoint {
    x: number;
    y: number;
    z: number;
    timestamp: Date;
    _tag: "AccelerometerDataPoint";
  }

  export interface RouteDataPoint {
    point: TimePoint;
    altitude: number;
    velocity?: number; // Optional: speed at this point (m/s)
    heading?: number;  // Optional: direction of movement in degrees
    accuracy?: number; // Optional: estimated accuracy of position (meters)
  }
  
  // Heart Rate Data Point
  
  export interface HeartRateDataPoint {
    heartRate: number; // in bpm
    timestamp: Date;
    accuracy: "high" | "medium" | "low";
    source?: string; // Optional source identifier
  }
  
  // Activity Zone Data
  
  export interface ActivityZoneData {
    zoneId: number;
    duration: number; // Time spent in this zone, in seconds
  }

  
  // Relationships (for reference):
  
  // User has many MacroPlans, Activities, HeartRateZones, and Thresholds.
  // MacroPlan has many PlanUnits and Events.
  // PlanUnit has many PlannedActivities.
  // Activity may reference a PlannedActivity.
  
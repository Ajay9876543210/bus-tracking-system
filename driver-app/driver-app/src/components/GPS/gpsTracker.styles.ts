import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  statusBadgeOn: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },

  statusBadgeOff: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 50,
    marginRight: 6,
  },

  statusDotOn: {
    backgroundColor: '#16a34a',
  },

  statusDotOff: {
    backgroundColor: '#94a3b8',
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  statusBadgeTextOn: {
    color: '#15803d',
  },

  statusBadgeTextOff: {
    color: '#64748b',
  },

  gpsButton: {
    minHeight: 54,
    borderRadius: 13,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },

  stopGpsButton: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonIcon: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    marginRight: 9,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  trackingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    padding: 13,
    borderRadius: 13,
    borderWidth: 1,
  },

  trackingStatusOn: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },

  trackingStatusOff: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },

  trackingStatusIcon: {
    fontSize: 17,
    marginRight: 10,
  },

  trackingStatusContent: {
    flex: 1,
  },

  trackingStatusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },

  trackingStatusText: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: '#64748b',
  },

  locationCard: {
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },

  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  locationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },

  locationSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: '#64748b',
  },

  locationIcon: {
    fontSize: 22,
  },

  locationGrid: {
    flexDirection: 'row',
    gap: 10,
  },

  locationItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 11,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.7,
    marginBottom: 5,
  },

  locationValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },

  speedCard: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },

  speedIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  speedContent: {
    flex: 1,
  },

  speedLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.7,
  },

  speedValue: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    color: '#1d4ed8',
  },

  speedUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },

  noLocationCard: {
    marginTop: 14,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  noLocationIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  noLocationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },

  noLocationText: {
    marginTop: 5,
    maxWidth: 270,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#64748b',
  },
});
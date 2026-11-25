import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  contentContainer: {
    paddingBottom: 30,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  loadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 4,
  },

  loadingText: {
    marginTop: 14,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brandMini: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  brandEmoji: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4f46e5',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 21,
    marginRight: 10,
  },

  brandName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },

  brandTagline: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },

  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    marginRight: 6,
  },

  onlineText: {
    color: '#15803d',
    fontSize: 9,
    fontWeight: '800',
  },

  welcomeBlock: {
    marginTop: 28,
  },

  welcomeLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },

  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 3,
  },

  subtitle: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    maxWidth: 330,
  },

  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  cardTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '800',
  },

  cardSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },

  infoGrid: {
    flexDirection: 'row',
    gap: 10,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    minHeight: 70,
    justifyContent: 'center',
  },

  label: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  value: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '700',
  },

  tripCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
  },

  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  tripTitle: {
    color: '#0f172a',
    fontSize: 19,
    fontWeight: '800',
  },

  tripSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },

  tripStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  activeBadge: {
    backgroundColor: '#f0fdf4',
  },

  idleBadge: {
    backgroundColor: '#f8fafc',
  },

  tripStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  activeDot: {
    backgroundColor: '#16a34a',
  },

  idleDot: {
    backgroundColor: '#94a3b8',
  },

  tripStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },

  activeStatusText: {
    color: '#15803d',
  },

  idleStatusText: {
    color: '#64748b',
  },

  tripDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    padding: 13,
    marginBottom: 16,
  },

  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 17,
    marginRight: 11,
  },

  detailLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  detailValue: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },

  statusValue: {
    color: '#16a34a',
    textTransform: 'uppercase',
  },

  gpsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },

  gpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  gpsTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
  },

  gpsSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 3,
  },

  gpsIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
  },

  emptyTrip: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },

  emptyTripIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  waitingText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '800',
  },

  smallText: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 17,
    maxWidth: 280,
  },

  selectionSection: {
    marginBottom: 14,
  },

  inputLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 7,
  },

  dropdown: {
    minHeight: 62,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  dropdownIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 17,
    marginRight: 10,
  },

  dropdownContent: {
    flex: 1,
  },

  dropdownLabel: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },

  dropdownText: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '700',
  },

  dropdownArrow: {
    color: '#64748b',
    fontSize: 12,
    paddingLeft: 8,
  },

  selectedDescription: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 3,
  },

  dropdownList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    marginTop: 6,
    overflow: 'hidden',
    elevation: 4,
  },

  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  optionContent: {
    flex: 1,
  },

  dropdownOptionTitle: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '800',
  },

  dropdownOptionDescription: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },

  selectedCheck: {
    color: '#4f46e5',
    fontSize: 19,
    fontWeight: '800',
    marginLeft: 8,
  },

  emptyOption: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    padding: 18,
  },

  startButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    elevation: 4,
  },

  startButtonIcon: {
    color: '#ffffff',
    fontSize: 15,
    marginRight: 9,
  },

  startButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  endButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  endButtonIcon: {
    color: '#ffffff',
    fontSize: 14,
    marginRight: 8,
  },

  endButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  logoutButton: {
    marginHorizontal: 16,
    marginTop: 18,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecaca',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutIcon: {
    color: '#dc2626',
    fontSize: 20,
    marginRight: 8,
  },

  logoutText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '800',
  },

  footerText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 18,
    paddingHorizontal: 20,
  },
});
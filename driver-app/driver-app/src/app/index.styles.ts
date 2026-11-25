import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  backgroundGlowTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#e0e7ff',
    top: -120,
    right: -90,
    opacity: 0.65,
  },

  backgroundGlowBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#dbeafe',
    bottom: -100,
    left: -90,
    opacity: 0.55,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 30,
  },

  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },

  logoEmoji: {
    fontSize: 36,
  },

  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.6,
  },

  tagline: {
    marginTop: 5,
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 5,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },

  fieldContainer: {
    marginBottom: 17,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  inputWrapper: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 13,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 13,
  },

  inputIcon: {
    width: 28,
    fontSize: 17,
    textAlign: 'center',
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0f172a',
    paddingHorizontal: 8,
  },

  eyeButton: {
    width: 38,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyeIcon: {
    fontSize: 18,
  },

  loginButton: {
    height: 54,
    borderRadius: 13,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },

  loginButtonDisabled: {
    opacity: 0.65,
  },

  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },

  loginArrow: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '600',
    marginLeft: 10,
  },

  footer: {
    alignItems: 'center',
    marginTop: 25,
  },

  footerText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },

  footerSubtext: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
});

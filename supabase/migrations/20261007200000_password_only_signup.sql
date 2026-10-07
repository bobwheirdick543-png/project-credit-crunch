-- Soul Life password-only signup hardening.
-- No signup email, OTP, or external email provider is required.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS adult_policy_accepted_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_lower_unique
  ON public.profiles (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS profiles_whatsapp_unique
  ON public.profiles (whatsapp)
  WHERE whatsapp IS NOT NULL;

CREATE OR REPLACE FUNCTION public.prepare_soul_life_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $fn$
BEGIN
  IF COALESCE(NEW.raw_user_meta_data ->> 'termsAccepted', 'false') <> 'true' THEN
    RAISE EXCEPTION 'Terms and Conditions must be accepted';
  END IF;
  IF COALESCE(NEW.raw_user_meta_data ->> 'adultPolicyAccepted', 'false') <> 'true' THEN
    RAISE EXCEPTION '18+ Policy must be accepted';
  END IF;
  NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, now());
  NEW.confirmed_at := COALESCE(NEW.confirmed_at, NEW.email_confirmed_at, now());
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS before_auth_user_signup ON auth.users;
CREATE TRIGGER before_auth_user_signup
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.prepare_soul_life_signup();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  INSERT INTO public.profiles
    (id,email,whatsapp,terms_accepted_at,adult_policy_accepted_at,habz,vault,level,xp,soul_rating)
  VALUES
    (NEW.id,COALESCE(NEW.email,''),NEW.raw_user_meta_data ->> 'whatsapp',
     CASE WHEN NEW.raw_user_meta_data ->> 'termsAccepted'='true' THEN COALESCE(NEW.created_at,now()) END,
     CASE WHEN NEW.raw_user_meta_data ->> 'adultPolicyAccepted'='true' THEN COALESCE(NEW.created_at,now()) END,
     5000,0,1,0,0)
  ON CONFLICT (id) DO UPDATE SET
    email=EXCLUDED.email,
    whatsapp=COALESCE(EXCLUDED.whatsapp,public.profiles.whatsapp),
    terms_accepted_at=COALESCE(public.profiles.terms_accepted_at,EXCLUDED.terms_accepted_at),
    adult_policy_accepted_at=COALESCE(public.profiles.adult_policy_accepted_at,EXCLUDED.adult_policy_accepted_at);
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.protect_profile_legal_acceptance()
RETURNS trigger
LANGUAGE plpgsql
AS $fn$
BEGIN
  NEW.terms_accepted_at := OLD.terms_accepted_at;
  NEW.adult_policy_accepted_at := OLD.adult_policy_accepted_at;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS profiles_protect_legal_acceptance ON public.profiles;
CREATE TRIGGER profiles_protect_legal_acceptance
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_legal_acceptance();

REVOKE EXECUTE ON FUNCTION public.prepare_soul_life_signup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_legal_acceptance() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_soul_life_signup() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.protect_profile_legal_acceptance() TO postgres, service_role;

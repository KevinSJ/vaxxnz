import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { config } from "./translations";

function getSearchParams() {
  return Object.fromEntries([
    ...new URL(window.location.toString()).searchParams.entries(),
  ]);
}

function getSearch(searchParams: Record<string, string>) {
  const sp = new URLSearchParams(searchParams).toString();
  return sp ? `?${sp}` : "";
}

function getBookingDataParams(searchParams: Record<string, string>) {
  const { lat, lng, placeName, radius } = searchParams;
  return {
    ...(lat ? { lat } : {}),
    ...(lng ? { lng } : {}),
    ...(placeName ? { placeName } : {}),
    ...(radius ? { radius } : {}),
  };
}

function getCanonicalHome() {
  const { protocol, host } = window.location;
  const searchParams = getBookingDataParams(getSearchParams());
  return `${protocol}//${host}${getSearch(searchParams)}`;
}
function getCanonicalHomeLocations() {
  const { protocol, host, pathname } = window.location;
  const searchParams = getBookingDataParams(getSearchParams());
  return `${protocol}//${host}${pathname}${getSearch(searchParams)}`;
}

function getCanonicalLocation() {
  const { protocol, host, pathname } = window.location;
  const searchParams = {};
  return `${protocol}//${host}${pathname}${getSearch(searchParams)}`;
}

function getCanonicalCalendarDay() {
  const { protocol, host, pathname } = window.location;
  const searchParams = getBookingDataParams(getSearchParams());
  return `${protocol}//${host}${pathname}${getSearch(searchParams)}`;
}

export enum RouteType {
  Home = "/",
  Locations = "/locations",
  Bookings = "/bookings",
  Booking = "/bookings/:date",
  Location = "/locations/:slug",
}

const VaxxCanonical: React.FC<{
  url: string;
  title: string;
  description: string;
  keywords: string[];
}> = ({ url, title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(",")} />

      {config.supportedLngs.map((lng) => {
        if (lng === "cimode") {
          return null;
        }
        if (lng === "en-NZ") {
          return null;
        }
        const locale = lng.toLowerCase();
        return (
          <link
            rel="alternate"
            href={`${url}&locale=${locale}`}
            hrefLang={`${locale}`}
          />
        );
      })}
    </Helmet>
  );
};

export function VaxxHelmet({
  routeType,
  locationName,
  suburb,
}: {
  routeType: RouteType;
  locationName?: string;
  suburb: string;
}) {
  const { date } = useParams<{ date: string }>();
  let title;
  let description;
  let keywords;

  const commonKeywords = [
    "covid",
    "vaccine",
    "nz",
    "covid-19",
    "vaccine near me",
    "vaccine rollout",
    "new zealand",
    "medsafe",
    "ministry of health",
    "vaccination",
    "vaccination centres",
    "group 3",
    "group 4",
    "vaccination sites",
    "vaccination locations",
  ];
  switch (routeType) {
    case RouteType.Home:
    case RouteType.Bookings:
      title =
        "Find a COVID-19 vaccine bookings in New Zealand | Vaccine finder New Zealand | See ways to get vaccinated near you | vaxx.nz";
      description =
        "See all vaccine slots for all vaccination sites to minimise the manual filtering hassle";
      keywords = [
        ...commonKeywords,
        "booking",
        "book",
        "book my vaccine",
        "vaccine schedule",
        "vaccination schedule",
        `${suburb}`,
      ];
      return (
        <VaxxCanonical
          url={getCanonicalHome()}
          title={title}
          description={description}
          keywords={keywords}
        />
      );
    case RouteType.Locations:
      title =
        "Find COVID-19 vaccination sites in New Zealand | Vaccine finder New Zealand | See ways to get vaccinated near you | vaxx.nz";
      description =
        "See all vaccine slots for all vaccination sites to minimise the manual filtering hassle";
      keywords = [...commonKeywords, `${suburb}`];
      return (
        <VaxxCanonical
          url={getCanonicalHomeLocations()}
          title={title}
          description={description}
          keywords={keywords}
        />
      );
    case RouteType.Booking:
      title = `Available to Book - ${date} | Find a COVID-19 vaccine | vaxx.nz`;
      description =
        "See all vaccine slots for all vaccination sites to minimise the manual filtering hassle";
      keywords = [
        ...commonKeywords,
        "booking",
        "book",
        "book my vaccine",
        "vaccine schedule",
        "vaccination schedule",
        `${suburb}`,
      ];
      return (
        <VaxxCanonical
          url={getCanonicalCalendarDay()}
          title={title}
          description={description}
          keywords={keywords}
        />
      );
    case RouteType.Location:
      title = `${locationName} | Walk-in/Drive-through COVID-19 vaccination site | Find a COVID-19 vaccine | vaxx.nz`;
      description =
        "See all vaccine slots for all vaccination sites to minimise the manual filtering hassle";
      keywords = [...commonKeywords, `${locationName}`];
      return (
        <VaxxCanonical
          url={getCanonicalLocation()}
          title={title}
          description={description}
          keywords={keywords}
        />
      );
  }
}

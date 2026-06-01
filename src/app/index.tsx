import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ─── Brand Config ────────────────────────────────────────────────────────────
const BRAND = {
  name: "zesto",
  tagline: "z",
  color: "#0ABFBC",
  colorDark: "#089a97",
};

// ─── Onboarding Slides ────────────────────────────────────────────────────────
// Replace `image` URIs with your own local assets or remote URLs.
// Using picsum/placeholder images as stand-ins for 3D illustration assets.
const slides = [
  {
    id: "1",
    title: "Discover Zesto",
    subtitle:
      "Zesto is a fast 24/7 delivery app for food and groceries near you.",
    image: "https://cdn-icons-png.flaticon.com/512/3724/3724788.png", // grocery bag icon – swap with your 3D asset
    bg: "#DFF5F5",
  },
  {
    id: "2",
    title: "Lightning Fast Delivery",
    subtitle:
      "Get your groceries delivered to your door in under 30 minutes, any time of day.",
    image: "https://cdn-icons-png.flaticon.com/512/2920/2920280.png", // delivery scooter icon
    bg: "#E8F5E9",
  },
  {
    id: "3",
    title: "Fresh & Quality Picks",
    subtitle:
      "Hand-picked fresh produce and top grocery brands curated just for you.",
    image: "https://cdn-icons-png.flaticon.com/512/2553/2553651.png", // fruit basket icon
    bg: "#FFF8E1",
  },
];

// ─── Dot Indicator ────────────────────────────────────────────────────────────
function PaginationDots({ count, active }: { count: number; active: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === active ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const handleContinue = () => {
    if (activeIndex < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      // Navigate to your main app screen here
      console.log("Onboarding complete!");
    }
  };

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={[styles.slide, { width }]}>
      {/* Coloured hero area */}
      <View style={[styles.hero, { backgroundColor: item.bg }]}>
        {/* Brand name */}
        <Text style={styles.brandName}>{BRAND.name}</Text>

        {/* 3D / illustration image */}
        <Image
          source={{ uri: item.image }}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* White card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

        <View style={{ height: 50 }} />

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            {activeIndex === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 8 }} />
        <PaginationDots count={slides.length} active={activeIndex} />
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <FlatList
        ref={flatRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={renderSlide}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_HEIGHT = height * 0.38;
const HERO_HEIGHT = height - CARD_HEIGHT;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // ── Slide layout ──────────────────────────────────────────────────────────
  slide: {
    flex: 1,
    flexDirection: "column",
  },

  // ── Hero (top coloured section) ───────────────────────────────────────────
  hero: {
    height: HERO_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 56,
    paddingHorizontal: 24,
    // Subtle circular lines effect via border radii on children (see heroRing below)
    overflow: "hidden",
  },
  brandName: {
    position: "absolute",
    top: 56,
    left: 24,
    fontFamily: "System", // swap with a custom italic font e.g. 'Pacifico'
    fontStyle: "italic",
    fontWeight: "800",
    fontSize: 32,
    color: BRAND.color,
    letterSpacing: -0.5,
  },
  heroImage: {
    width: width * 0.72,
    height: width * 0.72,
    marginTop: 20,
  },

  // ── White card (bottom section) ───────────────────────────────────────────
  card: {
    height: CARD_HEIGHT,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
    // Lift card above hero with shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  // ── Continue button ────────────────────────────────────────────────────────
  continueBtn: {
    width: "100%",
    backgroundColor: BRAND.color,
    borderRadius: 50,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 20,
    // Shadow
    shadowColor: BRAND.color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // ── Pagination dots ────────────────────────────────────────────────────────
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: BRAND.color,
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#D1D5DB",
  },
});

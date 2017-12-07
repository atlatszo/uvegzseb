package com.precognox.publishertracker.ranking;

import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Update;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

/**
 * Sample ranking plugin for the open source version. Replace this with your own implementation.
 */
public class ExampleRankingPlugin implements RankingPlugin {

    private static final double MIN_RATING = 0.0;
    private static final double MAX_RATING = 5.0;
    private static final double NEUTRAL_RATING = 2.5;

    @Override
    public List<RankingEntry> getRanking(List<DataOwner> publishers) {
        publishers = publishers.stream().filter(this::hasDocuments).collect(toList());

        if (publishers.isEmpty()) {
            return Collections.emptyList();
        }

        if (publishers.size() == 1) {
            return Collections.singletonList(
                    new RankingEntry(NEUTRAL_RATING, publishers.get(0).getLongName())
            );
        }

        Map<DataOwner, Double> scores = new HashMap<>();

        publishers.forEach(publisher -> scores.put(publisher, calculateScore(publisher)));

        Double maxScore = Collections.max(scores.values());
        Double minScore = Collections.min(scores.values());

        List<RankingEntry> results = new ArrayList<>();

        for (Map.Entry<DataOwner, Double> entry : scores.entrySet()) {
            double rating = getStarRating(entry.getValue(), maxScore, minScore);
            String publisherName = entry.getKey().getLongName();

            results.add(new RankingEntry(rating, publisherName));
        }

        results.sort(Comparator.comparing(RankingEntry::getScore).reversed());

        return results;
    }

    private boolean hasDocuments(DataOwner dataOwner) {
        long documentNum = dataOwner.getUpdates()
                .stream()
                .map(Update::getDocuments)
                .mapToLong(Collection::size)
                .sum();

        return documentNum > 0;
    }

    /**
     * Calculate score based on number of documents.
     *
     * @param dataOwner
     *
     * @return
     */
    private double calculateScore(DataOwner dataOwner) {
        return dataOwner.getUpdates().stream().map(Update::getDocuments).mapToDouble(Collection::size).sum();
    }

    /**
     * Calculate star rating (relative score). The best publisher will get 5.0, the worst will get 0.0.
     * The others will get a proportional rating in-between.
     *
     * @param publisherScore
     * @param highestScore
     * @param lowestScore
     * @return
     */
    private double getStarRating(double publisherScore, double highestScore, double lowestScore) {
        if (publisherScore == highestScore) {
            return MAX_RATING;
        }

        if (publisherScore == lowestScore) {
            return MIN_RATING;
        }

        double interval = highestScore - lowestScore;
        double relativeScore = publisherScore - lowestScore;

        double scorePercent = relativeScore / interval;

        return scorePercent * MAX_RATING;
    }

}

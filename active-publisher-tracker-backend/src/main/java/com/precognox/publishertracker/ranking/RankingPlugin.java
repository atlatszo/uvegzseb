package com.precognox.publishertracker.ranking;

import com.precognox.publishertracker.entities.DataOwner;

import java.util.List;

public interface RankingPlugin {

    List<RankingEntry> getRanking(List<DataOwner> publishers);

}
